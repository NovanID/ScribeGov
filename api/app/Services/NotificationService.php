<?php

namespace App\Services;

use App\Models\Disposition;
use App\Jobs\SendWhatsAppNotificationJob;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    /**
     * Send WhatsApp/Email notifications for a new disposition.
     *
     * @param Disposition $disposition
     */
    public function sendDispositionNotification(Disposition $disposition): void
    {
        // Dispatch WhatsApp Notification Job
        SendWhatsAppNotificationJob::dispatch($disposition->toUser, $disposition->letter, $disposition);
        
        Log::info("NotificationService: Dispatched WhatsApp notification for disposition ID {$disposition->id}");
    }
}
