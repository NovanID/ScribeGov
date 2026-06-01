<?php

namespace App\Services;

use App\Contracts\OcrServiceInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

class MockOcrService implements OcrServiceInterface
{
    /**
     * Process an image and extract letter data using a mock implementation.
     *
     * @param UploadedFile $file The image or PDF file to process
     * @return array Extracted data with confidence scores
     */
    public function extractData(UploadedFile $file): array
    {
        // Simulate processing time
        sleep(3);

        Log::info("MockOcrService: Processing file " . $file->getClientOriginalName());

        // We randomize one of the fields to have a low confidence score to trigger the UI requirement.
        $randomLowConfidenceField = collect(['number', 'sender', 'subject'])->random();

        $confidence = [
            'number' => $randomLowConfidenceField === 'number' ? rand(40, 65) : rand(80, 99),
            'date' => rand(85, 99),
            'sender' => $randomLowConfidenceField === 'sender' ? rand(40, 65) : rand(80, 99),
            'subject' => $randomLowConfidenceField === 'subject' ? rand(40, 65) : rand(80, 99),
        ];

        return [
            'data' => [
                'number' => 'SURAT/' . rand(100, 999) . '/2026',
                'date' => now()->format('Y-m-d'),
                'sender' => 'Dinas Pendidikan Provinsi',
                'subject' => 'Undangan Rapat Koordinasi Tahunan',
            ],
            'confidence' => $confidence,
        ];
    }
}
