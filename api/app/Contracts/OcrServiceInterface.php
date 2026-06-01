<?php

namespace App\Contracts;

use Illuminate\Http\UploadedFile;

interface OcrServiceInterface
{
    /**
     * Process an image and extract letter data.
     *
     * @param UploadedFile $file The image or PDF file to process
     * @return array Extracted data with confidence scores
     */
    public function extractData(UploadedFile $file): array;
}
