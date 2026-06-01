<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

use App\Models\Disposition;
use App\Models\User;
use App\Models\Letter;
use Illuminate\Support\Facades\Log;

class SendWhatsAppNotificationJob implements ShouldQueue
{
    use Queueable;

    protected $user;
    protected $letter;
    protected $disposition;

    /**
     * Create a new job instance.
     */
    public function __construct(User $user, Letter $letter, ?Disposition $disposition = null)
    {
        $this->user = $user;
        $this->letter = $letter;
        $this->disposition = $disposition;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Generate a mock JWT for the magic link (In real app, use tymon/jwt-auth or similar)
        $token = base64_encode(json_encode([
            'user_id' => $this->user->id,
            'exp' => time() + (72 * 3600)
        ]));
        
        $magicLink = config('app.url') . ":3000/magic-login?token={$token}&redirect=/letters/{$this->letter->id}";
        
        $urgency = $this->letter->urgency_level ?? 'Normal';
        $sender = $this->letter->sender;
        $subject = substr($this->letter->subject, 0, 120);
        
        $message = "📬 *Surat Baru — ScribeGov*\n";
        $message .= "Dari: {$sender}\n";
        $message .= "Perihal: {$subject}\n";
        $message .= "Status: {$urgency}\n\n";
        
        if ($this->disposition) {
            $message .= "Catatan Disposisi: {$this->disposition->note}\n\n";
        }
        
        $message .= "Klik untuk buka surat:\n";
        $message .= "{$magicLink}\n\n";
        $message .= "_(Link aktif selama 72 jam)_";

        // Mock sending via WhatsApp API
        Log::info("================ WHATSAPP NOTIFICATION MOCK ================\nTo: {$this->user->name} ({$this->user->email})\n\n{$message}\n============================================================");
    }
}
