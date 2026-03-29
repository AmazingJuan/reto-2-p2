<?php
namespace App\Services;

use App\Models\QuotationProposalOrder;
use App\Mail\QuotationGenerated;
use App\Mail\QuotationPending;
use App\Mail\WelcomeEmail;
use Illuminate\Support\Facades\Mail;

class MailService
{
    public static function sendQuotationPendingEmail(QuotationProposalOrder $quotationOrder): void
    {
        $email = $quotationOrder->getContactInfo()["email"];
        Mail::to($email)->queue(new QuotationPending($quotationOrder));
    }

    public static function sendQuotationGeneratedEmail(QuotationProposalOrder $quotationOrder): void
    {
        $email = $quotationOrder->getContactInfo()["email"];
        Mail::to($email)->queue(new QuotationGenerated($quotationOrder));
    }

    public static function sendWelcomeEmail(string $email, string $platformUrl): void
    {
        Mail::to($email)->queue(new WelcomeEmail($platformUrl));
    }
}
