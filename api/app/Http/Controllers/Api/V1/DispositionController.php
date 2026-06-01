<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Disposition;
use App\Models\Letter;
use App\Models\User;
use App\Services\DispositionRoutingService;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DispositionController extends Controller
{
    protected DispositionRoutingService $routingService;
    protected NotificationService $notificationService;

    public function __construct(DispositionRoutingService $routingService, NotificationService $notificationService)
    {
        $this->routingService = $routingService;
        $this->notificationService = $notificationService;
    }

    /**
     * Store a newly created disposition.
     */
    public function store(Request $request)
    {
        $request->validate([
            'letter_id' => 'required|exists:letters,id',
            'to_user_id' => 'required|exists:users,id',
            'note' => 'nullable|string|max:500',
        ]);

        $letter = Letter::findOrFail($request->letter_id);
        $fromUser = Auth::user();
        $toUser = User::findOrFail($request->to_user_id);

        DB::beginTransaction();
        try {
            // Create disposition
            $disposition = Disposition::create([
                'letter_id' => $letter->id,
                'from_user_id' => $fromUser->id,
                'to_user_id' => $toUser->id,
                'note' => $request->note,
                'status' => 'pending',
            ]);

            // Update letter status
            $letter->status = 'Didisposisi';
            $letter->save();

            // Log audit trail
            \App\Models\AuditLog::create([
                'letter_id' => $letter->id,
                'user_id' => $fromUser->id,
                'action' => 'disposition_created',
                'metadata' => [
                    'description' => "Disposisi surat ke {$toUser->name} dengan catatan: {$request->note}",
                    'ip_address' => $request->ip(),
                ]
            ]);

            // Dispatch placeholder notification job
            $this->notificationService->sendDispositionNotification($disposition);

            DB::commit();

            return response()->json([
                'message' => 'Disposisi berhasil dikirim',
                'data' => $disposition
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Gagal membuat disposisi', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get route suggestion for disposition based on target level.
     */
    public function suggest(Request $request)
    {
        $request->validate([
            'target_level' => 'required|integer',
        ]);

        $user = Auth::user();
        
        if (!$user->organization_id) {
            return response()->json(['message' => 'User does not belong to any organization.'], 400);
        }

        $path = $this->routingService->suggestRoute($user->organization_id, $request->target_level);

        if (empty($path)) {
            return response()->json([
                'message' => 'No route found to the target level.',
                'suggested_users' => []
            ], 404);
        }

        // The next recipient organization is the second element in the path (index 1)
        // If the path only has 1 element, we are already at the target level.
        $nextOrgId = count($path) > 1 ? $path[1] : $path[0];

        $suggestedUsers = User::where('organization_id', $nextOrgId)->get(['id', 'name', 'email']);

        return response()->json([
            'path' => $path,
            'next_organization_id' => $nextOrgId,
            'suggested_users' => $suggestedUsers
        ]);
    }

    /**
     * Get the timeline of a letter's dispositions.
     */
    public function timeline($letterId)
    {
        $dispositions = Disposition::with(['fromUser.organization', 'toUser.organization'])
            ->where('letter_id', $letterId)
            ->orderBy('created_at', 'asc')
            ->get();

        $letter = Letter::findOrFail($letterId);

        $timeline = [];
        
        // Add initial received event
        $timeline[] = [
            'type' => 'received',
            'actor' => 'Sistem',
            'role' => 'Tata Usaha',
            'action' => 'Surat diterima dan diregistrasi',
            'timestamp' => $letter->created_at,
        ];

        foreach ($dispositions as $disp) {
            $timeline[] = [
                'type' => 'disposition',
                'actor' => $disp->fromUser->name,
                'role' => $disp->fromUser->organization ? $disp->fromUser->organization->name : 'Staff',
                'recipient' => $disp->toUser->name,
                'action' => 'Mendisposisikan surat',
                'note' => $disp->note,
                'timestamp' => $disp->created_at,
                'status' => $disp->status,
            ];
        }

        return response()->json(['data' => $timeline]);
    }
}
