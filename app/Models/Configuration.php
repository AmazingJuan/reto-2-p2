<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Configuration extends Model
{
    /**
     * Attributes:
     *
     * $this->attributes['id'] - int - Primary key identifier
     * $this->attributes['notification_email'] - string|null - Notification email (nullable en BD)
     * $this->attributes['application_url'] - string|null - Application URL (nullable en BD)
     */
    protected $fillable = [
        'notification_email',
        'application_url',
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

    public function getApplicationUrl(): ?string
    {
        $v = $this->application_url;
        if ($v === null) {
            return null;
        }
        $t = trim((string) $v);

        return $t === '' ? null : $t;
    }

    public function setNotificationEmail(string $notificationEmail): void
    {
        $this->notification_email = trim($notificationEmail);
    }

    public function setApplicationUrl(string $applicationUrl): void
    {
        $this->application_url = $applicationUrl;
    }
}
