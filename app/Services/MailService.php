<?php

namespace App\Services;

use App\Mail\QuotationGenerated;
use App\Mail\QuotationGeneratedAdmin;
use App\Mail\QuotationPending;
use App\Mail\QuotationPendingAdmin;
use App\Mail\WelcomeEmail;
use App\Models\Configuration;
use App\Models\QuotationProposalOrder;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Mail;

/**
 * Queues every outgoing e-mail. Each quotation event notifies the client
 * (when it has an address) and the admin notification inbox (when configured).
 */
class MailService
{
    public function sendQuotationPending(QuotationProposalOrder $order): void
    {
        $this->notifyClient($order, new QuotationPending($order));
        $this->notifyAdmin(new QuotationPendingAdmin($order));
    }

    public function sendQuotationGenerated(QuotationProposalOrder $order): void
    {
        $this->notifyClient($order, new QuotationGenerated($order));
        $this->notifyAdmin(new QuotationGeneratedAdmin($order));
    }

    public function sendWelcome(string $email): void
    {
        Mail::to($email)->queue(new WelcomeEmail);
    }

    private function notifyClient(QuotationProposalOrder $order, Mailable $mail): void
    {
        $email = $order->loadMissing('client')->getClient()?->getEmail();

        if ($email) {
            Mail::to($email)->queue($mail);
        }
    }

    private function notifyAdmin(Mailable $mail): void
    {
        $email = Configuration::current()?->getNotificationEmail();

        if ($email) {
            Mail::to($email)->queue($mail);
        }
    }
}
