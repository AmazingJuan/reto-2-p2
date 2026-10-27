<?php

namespace Tests\Feature;

use App\Models\BusinessUnit;
use App\Models\Condition;
use App\Models\QuotationDocument;
use App\Models\QuotationProposalOrder;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class QuotationDocumentsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('documents');
        Mail::fake();

        $unit = BusinessUnit::create(['name' => 'consultoria', 'display_name' => 'Consultoría', 'abbreviation' => 'CON']);
        $files = Condition::create(['label' => 'Adjuntar documentos', 'interaction_type' => 'input', 'type' => 'file', 'required' => false, 'business_unit_id' => $unit->id]);
        $first = Condition::create(['label' => 'Sector', 'interaction_type' => 'input', 'type' => 'text', 'business_unit_id' => $unit->id, 'next_condition_id' => $files->id]);
        $unit->update(['initial_condition_id' => $first->id]);
    }

    public function test_attached_documents_are_kept_on_the_documents_disk(): void
    {
        $this->post('/cotizar', $this->payload([
            UploadedFile::fake()->create('Mapa de procesos.pdf', 300, 'application/pdf'),
            UploadedFile::fake()->create('organigrama.xlsx', 50),
        ]))->assertSessionHasNoErrors();

        $order = QuotationProposalOrder::sole();
        $this->assertSame('Mapa de procesos.pdf, organigrama.xlsx', $order->getAnswers()['Adjuntar documentos']);

        $documents = $order->getDocuments()->sortBy('id')->values();
        $this->assertSame(['Mapa de procesos.pdf', 'organigrama.xlsx'], $documents->map->getOriginalName()->all());
        $this->assertSame(['Adjuntar documentos', 'Adjuntar documentos'], $documents->map->getQuestion()->all(), 'kept with the question they answer');
        $this->assertSame(300 * 1024, $documents[0]->getSize());
        $this->assertSame('documents', $documents[0]->getDisk());
        $this->assertStringStartsWith('quotations/'.$order->getId().'/', $documents[0]->getPath());
        Storage::disk('documents')->assertExists($documents->map->getPath()->all());
    }

    public function test_documents_are_optional(): void
    {
        $this->post('/cotizar', $this->payload())->assertSessionHasNoErrors();

        $this->assertSame(0, QuotationDocument::count());
    }

    public function test_type_size_and_number_of_documents_are_limited(): void
    {
        $this->post('/cotizar', $this->payload([UploadedFile::fake()->create('virus.exe', 10)]))
            ->assertSessionHasErrors('documents.0.file');
        $this->post('/cotizar', $this->payload([UploadedFile::fake()->create('grande.pdf', QuotationDocument::MAX_KILOBYTES + 1)]))
            ->assertSessionHasErrors('documents.0.file');
        $this->post('/cotizar', $this->payload(array_map(
            fn ($n) => UploadedFile::fake()->create("doc{$n}.pdf", 10),
            range(1, QuotationDocument::MAX_FILES + 1),
        )))->assertSessionHasErrors('documents');

        $this->assertSame(0, QuotationProposalOrder::count());
        $this->assertSame([], Storage::disk('documents')->allFiles());
    }

    public function test_a_document_must_belong_to_an_answered_question(): void
    {
        $payload = $this->payload([UploadedFile::fake()->create('a.pdf', 10)]);
        $payload['documents'][0]['question'] = 'Pregunta que no se respondió';

        $this->post('/cotizar', $payload)->assertSessionHasErrors('documents.0.question');

        $this->assertSame(0, QuotationProposalOrder::count());
    }

    public function test_bots_caught_by_the_honeypot_store_no_documents(): void
    {
        $this->post('/cotizar', [...$this->payload([UploadedFile::fake()->create('a.pdf', 10)]), 'web' => 'spam']);

        $this->assertSame([], Storage::disk('documents')->allFiles());
    }

    public function test_the_admin_sees_and_downloads_the_documents_of_the_request_only(): void
    {
        $this->post('/cotizar', $this->payload([UploadedFile::fake()->createWithContent('alcance.pdf', '%PDF-1.4 alcance')]));
        $this->post('/cotizar', $this->payload([UploadedFile::fake()->create('otro.pdf', 10)]));
        [$order, $other] = QuotationProposalOrder::query()->orderBy('quotation_code')->get();
        $document = $order->getDocuments()->sole();

        $this->get(route('dashboard.quotation-orders.documents.download', [$order, $document]))->assertRedirect(route('login'));

        $this->actingAs(User::factory()->create());

        $this->get(route('dashboard.quotation-orders.show', $order))
            ->assertInertia(fn (Assert $page) => $page
                ->where('viewData.quotationOrder.documents.0.original_name', 'alcance.pdf')
                ->where('viewData.quotationOrder.documents.0.question', 'Adjuntar documentos')
                ->missing('viewData.quotationOrder.documents.0.path'));

        $response = $this->get(route('dashboard.quotation-orders.documents.download', [$order, $document]))->assertOk();
        $this->assertStringContainsString('alcance.pdf', $response->headers->get('content-disposition'));
        $this->assertSame('%PDF-1.4 alcance', $response->streamedContent());

        $this->get(route('dashboard.quotation-orders.documents.download', [$other, $document]))->assertNotFound();
    }

    /**
     * @param  list<UploadedFile>  $documents
     * @return array<string, mixed>
     */
    private function payload(array $documents = []): array
    {
        return [
            'contact' => ['name' => 'Ana', 'email' => 'ana@empresa.com', 'phone' => '3001234567', 'company' => 'Clínica Sana', 'role' => 'Coordinadora HSEQ'],
            'businessUnit' => 'Consultoría',
            'answers' => ['Sector' => 'Salud', ...($documents ? ['Adjuntar documentos' => implode(', ', array_map(fn ($f) => $f->getClientOriginalName(), $documents))] : [])],
            'documents' => array_map(fn ($file) => ['question' => 'Adjuntar documentos', 'file' => $file], $documents),
            'privacy_accepted' => true,
        ];
    }
}
