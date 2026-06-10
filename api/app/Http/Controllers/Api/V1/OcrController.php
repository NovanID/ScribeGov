<?php

namespace App\Http\Controllers\Api\V1;

use App\Contracts\OcrServiceInterface;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class OcrController extends Controller
{
    protected OcrServiceInterface $ocrService;

    public function __construct(OcrServiceInterface $ocrService)
    {
        $this->ocrService = $ocrService;
    }

    /**
     * Process an uploaded image using OCR and return extracted data.
     */
    public function scan(Request $request)
    {
        $request->validate([
            'image' => 'required|file|mimes:jpeg,png,jpg,pdf,doc,docx|max:5120',
        ]);

        try {
            $result = $this->ocrService->extractData($request->file('image'));
            
            return response()->json([
                'message' => 'OCR processing successful',
                'data' => $result['data'],
                'confidence' => $result['confidence']
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to process OCR',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
