<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Configuration extends Model
{
    protected $fillable = [
        'notification_email',
        'company_contact_email',
        'company_contact_phone',
        'company_contact_address',
        'company_website_url',
        'company_website_label',
    ];

    public function getId(): int
    {
        return $this->attributes['id'];
    }

    public function getNotificationEmail(): ?string
    {
        $v = $this->notification_email;
        if ($v === null) {
            return null;
        }
        $t = trim((string) $v);

        return $t === '' ? null : $t;
    }

    public function getCompanyContactEmail(): ?string
    {
        return $this->nullableTrimmedString('company_contact_email');
    }

    public function getCompanyContactPhone(): ?string
    {
        return $this->nullableTrimmedString('company_contact_phone');
    }

    public function getCompanyContactAddress(): ?string
    {
        return $this->nullableTrimmedString('company_contact_address');
    }

    public function getCompanyWebsiteUrl(): ?string
    {
        return $this->nullableTrimmedString('company_website_url');
    }

    public function getCompanyWebsiteLabel(): ?string
    {
        return $this->nullableTrimmedString('company_website_label');
    }

    public function setNotificationEmail(string $notificationEmail): void
    {
        $this->notification_email = trim($notificationEmail);
    }

    private function nullableTrimmedString(string $key): ?string
    {
        $v = $this->attributes[$key] ?? null;
        if ($v === null) {
            return null;
        }
        $t = trim((string) $v);

        return $t === '' ? null : $t;
    }
}
