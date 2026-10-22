<?php

namespace Tests\Feature;

use App\Mail\QuotationPending;
use App\Mail\QuotationPendingAdmin;
use App\Models\BusinessUnit;
use App\Models\Client;
use App\Models\Condition;
use App\Models\Configuration;
use App\Models\GestionLine;
use App\Models\Professional;
use App\Models\QuotationProposalOrder;
use App\Models\Service;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class QuotationFlowTest extends TestCase
{
    use RefreshDatabase;

    private BusinessUnit $unit;

    protected function setUp(): void
    {
        parent::setUp();

        $this->unit = BusinessUnit::create(['name' => 'consultoria', 'display_name' => 'Consultoría', 'abbreviation' => 'CON']);
        $line = GestionLine::create(['name' => 'Calidad']);
        Service::create(['name' => 'ISO 9001', 'business_unit_id' => $this->unit->id, 'gestion_line_id' => $line->id]);
        $assets = GestionLine::create(['name' => 'Activos']);
        Service::create(['name' => 'ISO 55001', 'business_unit_id' => $this->unit->id, 'gestion_line_id' => $assets->id]);

        $second = Condition::create(['label' => 'Empleados', 'interaction_type' => 'input', 'type' => 'number', 'business_unit_id' => $this->unit->id]);
        $first = Condition::create(['label' => 'Sector', 'interaction_type' => 'input', 'type' => 'text', 'business_unit_id' => $this->unit->id, 'next_condition_id' => $second->id]);
        Condition::create(['label' => 'Huérfana', 'interaction_type' => 'input', 'type' => 'text', 'business_unit_id' => $this->unit->id]);
        $this->unit->update(['initial_condition_id' => $first->id]);
    }

    public function test_quote_page_exposes_only_reachable_conditions(): void
    {
        $this->get('/cotizar/consultoria')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('quotation/index')
                ->where('viewData.businessUnit', 'Consultoría')
                ->where('viewData.services.Calidad', ['ISO 9001'])
                ->where('viewData.gestionLines', ['Activos', 'Calidad'])
                ->has('viewData.conditions', 2));
    }

    public function test_unknown_business_unit_redirects_with_error(): void
    {
        $this->get('/cotizar/no-existe')
            ->assertRedirect(route('quotation.select.business_unit'))
            ->assertSessionHas('error');
    }

    public function test_storing_a_quotation_creates_client_order_and_queues_mails(): void
    {
        Mail::fake();
        Configuration::query()->update(['notification_email' => 'admin@example.com']);

        $this->post('/cotizar', $this->payload())->assertRedirect(route('home'));

        $order = QuotationProposalOrder::sole();
        $this->assertSame('CON-'.now()->format('y').'01', $order->getQuotationCode());
        $this->assertSame(['Sector' => 'Salud', 'Empleados' => '40'], $order->getAnswers());
        $this->assertSame('ana@empresa.com', $order->getClient()->getEmail());
        $this->assertSame('3001234567', $order->getClient()->getPhone());

        Mail::assertQueued(QuotationPending::class, fn ($mail) => $mail->hasTo('ana@empresa.com'));
        Mail::assertQueued(QuotationPendingAdmin::class, fn ($mail) => $mail->hasTo('admin@example.com'));
    }

    public function test_a_request_can_combine_services_from_several_lines(): void
    {
        Mail::fake();

        $this->post('/cotizar', $this->payload([
            'gestionLines' => ['Calidad', 'Activos'],
            'services' => ['ISO 9001', 'ISO 55001'],
        ]))->assertSessionHasNoErrors();

        $order = QuotationProposalOrder::sole();
        $this->assertSame('Calidad, Activos', $order->getGestionLine());
        $this->assertSame(['ISO 9001', 'ISO 55001'], $order->getServices());
    }

    public function test_services_must_belong_to_the_unit_and_lines(): void
    {
        $other = BusinessUnit::create(['name' => 'otra', 'display_name' => 'Otra', 'abbreviation' => 'OT']);
        Service::create(['name' => 'Ajeno', 'business_unit_id' => $other->id, 'gestion_line_id' => GestionLine::where('name', 'Calidad')->value('id')]);

        $this->post('/cotizar', $this->payload(['services' => ['ISO 9001', 'Ajeno']]))->assertSessionHasErrors('services');
        $this->post('/cotizar', $this->payload(['services' => ['ISO 55001']]))->assertSessionHasErrors('services');
        $this->post('/cotizar', $this->payload(['services' => ['Inventado']]))->assertSessionHasErrors('services');

        $this->assertSame(0, QuotationProposalOrder::count());
    }

    public function test_professional_must_work_in_one_of_the_lines(): void
    {
        $professional = Professional::create(['name' => 'Ana', 'summary' => 'x', 'years_experience' => 5]);
        $professional->gestionLines()->sync([GestionLine::where('name', 'Activos')->value('id')]);

        $this->post('/cotizar', $this->payload(['professional_id' => $professional->id]))->assertSessionHasErrors('professional_id');

        Mail::fake();
        $this->post('/cotizar', $this->payload([
            'gestionLines' => ['Calidad', 'Activos'],
            'services' => ['ISO 9001', 'ISO 55001'],
            'professional_id' => $professional->id,
        ]))->assertSessionHasNoErrors();
    }

    public function test_privacy_authorization_is_required(): void
    {
        $this->post('/cotizar', $this->payload(['privacy_accepted' => false]))->assertSessionHasErrors('privacy_accepted');

        $this->assertSame(0, QuotationProposalOrder::count());
    }

    public function test_repeated_client_is_updated_instead_of_duplicated(): void
    {
        Mail::fake();

        $this->post('/cotizar', $this->payload());
        $this->post('/cotizar', $this->payload(['contact' => ['name' => 'Ana María', 'email' => 'ANA@empresa.com', 'phone' => '300 123 4567']]));

        $this->assertSame(1, Client::count());
        $this->assertSame('Ana María', Client::sole()->getName());
        $this->assertSame(2, QuotationProposalOrder::count());
    }

    public function test_receive_link_requires_a_valid_signature(): void
    {
        $order = $this->generatedOrder();

        $this->get(route('quotation.receive', $order->getId()))
            ->assertRedirect(route('home'))
            ->assertSessionHas('error');

        $this->assertFalse($order->fresh()->getViewedByClient());
    }

    public function test_receive_link_marks_quotation_as_viewed_and_redirects_to_document(): void
    {
        $order = $this->generatedOrder();

        $this->get(URL::signedRoute('quotation.receive', ['quotationId' => $order->getId()]))
            ->assertRedirect('https://docs.example.com/propuesta.pdf');

        $this->assertTrue($order->fresh()->getViewedByClient());
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function payload(array $overrides = []): array
    {
        return array_replace([
            'contact' => ['name' => 'Ana', 'email' => 'ana@empresa.com', 'phone' => '300 123 4567', 'company' => '', 'role' => ''],
            'businessUnit' => 'Consultoría',
            'gestionLines' => ['Calidad'],
            'services' => ['ISO 9001'],
            'answers' => ['Sector' => 'Salud', 'Empleados' => '40'],
            'privacy_accepted' => true,
        ], $overrides);
    }

    private function generatedOrder(): QuotationProposalOrder
    {
        return QuotationProposalOrder::create([
            'business_unit' => 'Consultoría',
            'gestion_line' => 'Calidad',
            'services' => ['ISO 9001'],
            'answers' => [],
            'is_generated' => true,
            'quotation_url' => 'https://docs.example.com/propuesta.pdf',
        ]);
    }
}
