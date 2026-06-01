<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Kredensial tidak valid.'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'token' => $token,
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    public function magicLink(Request $request)
    {
        $request->validate([
            'token' => 'required|string'
        ]);

        try {
            $payload = json_decode(base64_decode($request->token), true);
            
            if (!$payload || !isset($payload['user_id']) || !isset($payload['exp'])) {
                return response()->json(['message' => 'Invalid token format'], 400);
            }

            if (time() > $payload['exp']) {
                return response()->json(['message' => 'Token has expired'], 401);
            }

            $user = User::findOrFail($payload['user_id']);
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Login via magic link successful',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Invalid magic link token'], 401);
        }
    }
}
