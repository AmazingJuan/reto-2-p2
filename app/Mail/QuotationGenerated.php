<?php

namespace App\Mail;

use App\Models\QuotationOrder;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class QuotationGenerated extends Mailable
{
    use Queueable, SerializesModels;

    public QuotationOrder $order;

    /**
     * Create a new message instance.
     *
     * @param  array  $mailData
     */
    public function __construct(QuotationOrder $order)
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
