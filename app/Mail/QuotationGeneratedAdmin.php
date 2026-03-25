<?php

namespace App\Mail;

use App\Models\QuotationProposalOrder;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class QuotationGeneratedAdmin extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public QuotationProposalOrder $quotationOrder,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Cotización #'.$this->quotationOrder->getId().' generada (cliente notificado)',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.admin.quotation-generated',
        );
    }

    /**
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
