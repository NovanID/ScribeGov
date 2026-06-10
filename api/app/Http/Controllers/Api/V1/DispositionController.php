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
            'to_user_ids' => 'required|array|min:1',
            'to_user_ids.*' => 'exists:users,id',
            'note' => 'nullable|string|max:500',
            'priority' => 'nullable|string|in:Biasa,Penting,Segera',
            'due_date' => 'nullable|date',
        ]);

        $letter = Letter::findOrFail($request->letter_id);
        $fromUser = Auth::user();

        DB::beginTransaction();
        try {
            $dispositions = [];
            
            foreach ($request->to_user_ids as $toUserId) {
                $toUser = User::findOrFail($toUserId);
                
                // Create disposition
                $disposition = Disposition::create([
                    'letter_id' => $letter->id,
                    'from_user_id' => $fromUser->id,
                    'to_user_id' => $toUser->id,
                    'note' => $request->note,
                    'priority' => $request->priority ?? 'Biasa',
                    'due_date' => $request->due_date,
                    'status' => 'pending',
                ]);
                $dispositions[] = $disposition;

                // Dispatch placeholder notification job
                $this->notificationService->sendDispositionNotification($disposition);
            }

            // Update letter status
            $letter->status = 'Didisposisi';
            $letter->save();

            // Log audit trail
            \App\Models\AuditLog::create([
                'letter_id' => $letter->id,
                'user_id' => $fromUser->id,
                'action' => 'disposition_created',
                'metadata' => [
                    'description' => "Disposisi surat ke " . count($request->to_user_ids) . " penerima dengan catatan: {$request->note}",
                    'ip_address' => $request->ip(),
                ]
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Disposisi berhasil dikirim',
                'data' => $dispositions
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Gagal membuat disposisi', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get all users grouped by organization for manual selection.
     */
    public function getUsersGroupedByOrg()
    {
        $users = User::with('organization')->get();
        $grouped = [];

        foreach ($users as $user) {
            $orgName = $user->organization ? $user->organization->name : 'Lainnya';
            if (!isset($grouped[$orgName])) {
                $grouped[$orgName] = [];
            }
            $grouped[$orgName][] = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ];
        }

        return response()->json(['data' => $grouped]);
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

        $auditLogs = \App\Models\AuditLog::with('user.organization')
            ->where('letter_id', $letterId)
            ->where('action', 'letter_signed')
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
                'priority' => $disp->priority,
                'due_date' => $disp->due_date,
            ];
        }

        foreach ($auditLogs as $log) {
            $timeline[] = [
                'type' => 'signed',
                'actor' => $log->user->name ?? 'Sistem',
                'role' => ($log->user && $log->user->organization) ? $log->user->organization->name : 'Staff',
                'action' => 'Menandatangani dokumen elektronik',
                'note' => isset($log->metadata['description']) ? $log->metadata['description'] : 'Dokumen bersertifikat elektronik.',
                'timestamp' => $log->created_at,
            ];
        }

        usort($timeline, function($a, $b) {
            return strtotime($a['timestamp']) - strtotime($b['timestamp']);
        });

        return response()->json(['data' => $timeline]);
    }
}
