<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Configuration extends Model
{
    /**
     * Attributes:
     *
     * $this->attributes['id'] - int - Primary key identifier
     * $this->attributes['notification_email'] - string - Notification email
     * $this->attributes['application_url'] - string - Application URL
     */
    protected $fillable = [
        'notification_email',
        'application_url',
    ];

    public function getId(): int
    {
        return $this->attributes['id'];
    }

    public function getNotificationEmail(): string
    {
        return $this->notification_email;
    }

    public function getApplicationUrl(): string
    {
        return $this->application_url;
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
