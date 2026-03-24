<?php

namespace App\Mail;

use App\Models\QuotationProposalOrder;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class QuotationGenerated extends Mailable
{
    use Queueable, SerializesModels;

    public QuotationProposalOrder $order;

    /**
     * Create a new message instance.
     *
     * @param  array  $mailData
     */
    public function __construct(QuotationProposalOrder $order)
    {
        $this->order = $order;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $id = $this->order->getId();
        $subject = 'Tu cotización #'.$id.' está lista';

        return $this
            ->subject($subject)
            ->view('emails.quotation-generated');
    }
}
