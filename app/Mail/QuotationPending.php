<?php

namespace App\Mail;

use App\Models\QuotationProposalOrder;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class QuotationPending extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * La cotización asociada a este correo.
     */
    public QuotationProposalOrder $quotationOrder;

    /**
     * Crear una nueva instancia del mensaje.
     */
    public function __construct(QuotationProposalOrder $quotationOrder)
    {
        $this->quotationOrder = $quotationOrder;
    }

    /**
     * Define el sobre del mensaje (asunto, remitente, etc.).
     */
    public function envelope(): Envelope
    {
        $ref = $this->quotationOrder->getQuotationCode() ?? $this->quotationOrder->getId();

        return new Envelope(
            subject: 'Tu cotización '.$ref.' está pendiente',
        );
    }

    /**
     * Define el contenido del mensaje (vista y datos).
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.quotation-pending',
            with: [
                'quotationOrder' => $this->quotationOrder,
            ],
        );
    }

    /**
     * Archivos adjuntos (si los hubiera).
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
