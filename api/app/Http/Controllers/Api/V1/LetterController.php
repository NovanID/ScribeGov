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
            $letter->file_url = \Illuminate\Support\Facades\URL::temporarySignedRoute(
                'letters.view', now()->addMinutes(30), ['id' => $letter->id]
            );
            $letter->download_url = \Illuminate\Support\Facades\URL::temporarySignedRoute(
                'letters.download', now()->addMinutes(30), ['id' => $letter->id]
            );
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

    public function viewFile($id)
    {
        $letter = Letter::findOrFail($id);
        
        if (!$letter->file_path || !Storage::exists($letter->file_path)) {
            abort(404, 'File not found');
        }

        $path = Storage::path($letter->file_path);
        return response()->file($path, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . $letter->number . '.pdf"'
        ]);
    }

    public function download($id)
    {
        $letter = Letter::findOrFail($id);
        
        if (!$letter->file_path || !Storage::exists($letter->file_path)) {
            abort(404, 'File not found');
        }

        $filename = 'Surat_' . str_replace(['/', '\\'], '_', $letter->number) . '.pdf';
        return Storage::download($letter->file_path, $filename);
    }

    public function destroy($id)
    {
        $letter = Letter::findOrFail($id);
        
        if ($letter->file_path && Storage::exists($letter->file_path)) {
            Storage::delete($letter->file_path);
        }

        $letter->delete();

        return response()->json(['message' => 'Surat berhasil dihapus']);
    }
}
