<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Letter;
use Illuminate\Support\Facades\Auth;

class InboxController extends Controller
{
    public function index(Request $request)
    {
        // For MVP, we simply show all letters, or letters with specific status
        // Later we will filter this based on dispositions targeted to the user.
        $query = Letter::orderBy('created_at', 'desc');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where('subject', 'like', "%{$search}%")
                  ->orWhere('sender', 'like', "%{$search}%");
        }

        $letters = $query->get();

        return response()->json(['data' => $letters]);
    }
}
