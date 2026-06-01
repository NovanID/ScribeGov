<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Letter;
use App\Services\BsreTteService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SignatureController extends Controller
{
    protected BsreTteService $tteService;

    public function __construct(BsreTteService $tteService)
    {
        $this->tteService = $tteService;
    }

    /**
     * Sign a letter using BSrE passphrase.
     */
    public function sign(Request $request, $id)
    {
        $request->validate([
            'passphrase' => 'required|string',
        ]);

        $letter = Letter::findOrFail($id);
        $user = Auth::user();

        // Check if letter can be signed (e.g. status needs to be appropriate)
        // For MVP, we just allow signing.

        try {
            $this->tteService->signLetter($letter, $user, $request->passphrase);

            $letter->status = 'Signed';
            $letter->save();

            // Log audit trail
            \App\Models\AuditLog::create([
                'letter_id' => $letter->id,
                'user_id' => $user->id,
                'action' => 'letter_signed',
                'metadata' => [
                    'description' => "Dokumen telah ditandatangani secara elektronik via BSrE",
                    'ip_address' => $request->ip(),
                ]
            ]);

            return response()->json([
                'message' => 'Dokumen berhasil ditandatangani.',
                'data' => $letter
            ]);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('TTE Error: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
            return response()->json([
                'message' => 'Gagal menandatangani dokumen.',
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 400);
        }
    }

    /**
     * Batch sign multiple letters
     */
    public function batchSign(Request $request)
    {
        $request->validate([
            'letter_ids' => 'required|array',
            'letter_ids.*' => 'exists:letters,id',
            'passphrase' => 'required|string',
        ]);

        $user = $request->user();

        // Validate passphrase once for all
        if (!$user->tte_passphrase || !\Illuminate\Support\Facades\Hash::check($request->passphrase, $user->tte_passphrase)) {
            return response()->json(['message' => 'Passphrase TTE salah atau belum dikonfigurasi.'], 400);
        }

        $successCount = 0;
        $failedIds = [];

        foreach ($request->letter_ids as $id) {
            try {
                $letter = Letter::findOrFail($id);
                // Skip if already signed
                if ($letter->status === 'Signed') {
                    continue;
                }

                $this->tteService->signLetter($letter, $user, $request->passphrase);
                
                $letter->update([
                    'status' => 'Signed',
                ]);

                // Log audit trail
                \App\Models\AuditLog::create([
                    'letter_id' => $letter->id,
                    'user_id' => $user->id,
                    'action' => 'letter_signed',
                    'metadata' => [
                        'description' => "Dokumen telah ditandatangani secara massal via BSrE",
                        'ip_address' => $request->ip(),
                        'batch' => true
                    ]
                ]);

                $successCount++;
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Batch TTE Error for Letter ' . $id . ': ' . $e->getMessage());
                $failedIds[] = $id;
            }
        }

        return response()->json([
            'message' => "Berhasil menandatangani $successCount dokumen.",
            'success_count' => $successCount,
            'failed_ids' => $failedIds
        ]);
    }
}
