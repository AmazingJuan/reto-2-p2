<?php

namespace App\Mail;

use App\Models\QuotationProposalOrder;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class QuotationPendingAdmin extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public QuotationProposalOrder $quotationOrder,
    ) {}

    public function envelope(): Envelope
    {
        $ref = $this->quotationOrder->getQuotationCode() ?? '#'.$this->quotationOrder->getId();

        return new Envelope(
            subject: 'Nueva solicitud de cotización '.$ref,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.admin.quotation-pending',
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
