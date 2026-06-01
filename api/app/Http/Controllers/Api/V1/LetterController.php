<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Models\Letter;
use App\Models\AuditLog;

class LetterController extends Controller
{
    public function index()
    {
        $letters = Letter::orderBy('created_at', 'desc')->get();
        return response()->json(['data' => $letters]);
    }

    public function show($id)
    {
        $letter = Letter::findOrFail($id);
        
        // Generate signed URL if file exists
        if ($letter->file_path) {
            $letter->file_url = Storage::url($letter->file_path);
        }

        return response()->json(['data' => $letter]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'number' => 'required|string|max:255',
            'date' => 'required|date',
            'subject' => 'required|string|max:255',
            'sender' => 'required|string|max:255',
            'urgency_level' => 'required|string|in:Normal,Important,Urgent',
            'file' => 'nullable|file|mimes:pdf|max:10240',
        ]);

        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('private/letters');
        }

        $letter = Letter::create([
            'number' => $request->number,
            'date' => $request->date,
            'subject' => $request->subject,
            'sender' => $request->sender,
            'urgency_level' => $request->urgency_level,
            'status' => 'Diterima',
            'file_path' => $filePath,
        ]);

        // Log audit
        AuditLog::create([
            'letter_id' => $letter->id,
            'user_id' => Auth::id() ?? 1, // Fallback for testing
            'action' => 'REGISTER_LETTER',
            'metadata' => json_encode(['source' => 'manual']),
        ]);

        return response()->json(['message' => 'Surat berhasil disimpan', 'data' => $letter], 201);
    }
}
