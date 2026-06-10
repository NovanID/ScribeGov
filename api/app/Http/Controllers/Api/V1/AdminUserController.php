<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AdminUserController extends Controller
{
    /**
     * Get details of the currently authenticated user and their roles.
     */
    public function getCurrentUser(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'user' => $user,
            'roles' => $user->getRoleNames()
        ]);
    }

    /**
     * Get a list of all users in the system (Admin only).
     */
    public function index(Request $request)
    {
        if (!$request->user()->hasRole('Admin')) {
            return response()->json([
                'message' => 'Aksi ini tidak diizinkan. Hanya Admin yang dapat mengakses data ini.'
            ], 403);
        }

        $users = User::with('organization')->get();

        return response()->json([
            'data' => $users
        ]);
    }

    /**
     * Update the TTE passphrase of the currently authenticated Admin user.
     */
    public function updateOwnTtePassphrase(Request $request)
    {
        $user = $request->user();

        if (!$user->hasRole('Admin')) {
            return response()->json([
                'message' => 'Aksi ini tidak diizinkan. Hanya Admin yang dapat memperbarui Passphrase TTE.'
            ], 403);
        }

        $request->validate([
            'passphrase' => 'required|string|min:6|confirmed',
        ], [
            'passphrase.required' => 'Passphrase wajib diisi.',
            'passphrase.min' => 'Passphrase minimal terdiri dari 6 karakter.',
            'passphrase.confirmed' => 'Konfirmasi passphrase tidak cocok.',
        ]);

        $user->tte_passphrase = $request->passphrase;
        $user->save();

        Log::info("Admin [ID: {$user->id}, Name: {$user->name}] updated their own TTE passphrase.");

        return response()->json([
            'message' => "Passphrase TTE Anda berhasil diperbarui."
        ]);
    }
}
