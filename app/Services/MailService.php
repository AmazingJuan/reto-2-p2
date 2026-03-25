<?php

namespace App\Services;

use App\Mail\QuotationGenerated;
use App\Mail\QuotationGeneratedAdmin;
use App\Mail\QuotationPending;
use App\Mail\QuotationPendingAdmin;
use App\Models\Configuration;
use App\Models\QuotationProposalOrder;
use Illuminate\Support\Facades\Mail;

class MailService
{
    public static function sendQuotationPendingEmail(QuotationProposalOrder $quotationOrder): void
    {
        $email = $quotationOrder->getContactInfo()['email'];
        Mail::to($email)->send(new QuotationPending($quotationOrder));
        self::sendAdminQuotationPendingNotification($quotationOrder);
    }

    public static function sendQuotationGeneratedEmail(QuotationProposalOrder $quotationOrder): void
    {
        $email = $quotationOrder->getContactInfo()['email'];
        Mail::to($email)->send(new QuotationGenerated($quotationOrder));
        self::sendAdminQuotationGeneratedNotification($quotationOrder);
    }

    public static function sendAdminQuotationPendingNotification(QuotationProposalOrder $quotationOrder): void
    {
        $adminEmail = Configuration::first()->getNotificationEmail();
        if ($adminEmail === null) {
            return;
        }

        Mail::to($adminEmail)->send(new QuotationPendingAdmin($quotationOrder));
    }

    public static function sendAdminQuotationGeneratedNotification(QuotationProposalOrder $quotationOrder): void
    {
        $adminEmail = Configuration::first()->getNotificationEmail();
        if ($adminEmail === null) {
            return;
        }

        Mail::to($adminEmail)->send(new QuotationGeneratedAdmin($quotationOrder));
    }
}
