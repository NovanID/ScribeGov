<?php

namespace App\Services;

use App\Models\Letter;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use setasign\Fpdi\Fpdi;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class BsreTteService
{
    /**
     * Mock signing a letter with BSrE passphrase.
     *
     * @param Letter $letter
     * @param User $user
     * @param string $passphrase
     * @return bool
     * @throws \Exception
     */
    public function signLetter(Letter $letter, User $user, string $passphrase): bool
    {
        // 1. Validate Passphrase
        if (!$user->tte_passphrase || !Hash::check($passphrase, $user->tte_passphrase)) {
            throw new \Exception("Passphrase TTE salah atau belum dikonfigurasi.");
        }

        // 2. Simulate API Call to BSrE (2 seconds delay)
        sleep(2);
        
        Log::info("BSrE TTE Mock: Document {$letter->number} signed by {$user->name}");

        // 3. Stamp PDF with QR Code using FPDI
        $this->stampPdf($letter, $user);

        return true;
    }

    /**
     * Stamps the QR code onto the last page of the PDF.
     */
    private function stampPdf(Letter $letter, User $user)
    {
        // In a real application, the file path would be retrieved properly.
        // For MVP, if file_url is empty, we just skip physical stamping.
        if (empty($letter->file_url)) {
            return;
        }

        try {
            // Extract file path from URL (Assuming it's stored in storage/app/public or similar)
            // For MVP mock, we'll assume local relative path or skip if it's an external URL
            $path = parse_url($letter->file_url, PHP_URL_PATH);
            $filePath = public_path($path);

            if (!file_exists($filePath)) {
                Log::warning("TTE Stamping skipped: Original PDF not found at {$filePath}");
                return;
            }

            // Generate QR Code
            $qrContent = "Signed by: {$user->name} | BSrE Verified | Date: " . now()->toDateTimeString();
            
            // Generate PNG directly if ext-gd is enabled
            // We use base64 for fallback but FPDI needs a physical file for images
            $qrPath = storage_path('app/temp_qr_' . time() . '.png');
            QrCode::format('png')->size(100)->generate($qrContent, $qrPath);

            $pdf = new Fpdi();
            
            // Get page count
            $pageCount = $pdf->setSourceFile($filePath);

            for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
                $templateId = $pdf->importPage($pageNo);
                $size = $pdf->getTemplateSize($templateId);

                $pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
                $pdf->useTemplate($templateId);

                // If it's the last page, append the QR code
                if ($pageNo === $pageCount) {
                    // Position at bottom right (e.g., width - 40, height - 40)
                    $x = $size['width'] - 40;
                    $y = $size['height'] - 40;
                    
                    $pdf->Image($qrPath, $x, $y, 30, 30, 'PNG');
                    
                    $pdf->SetFont('Helvetica', '', 8);
                    $pdf->SetXY($x - 20, $y + 32);
                    $pdf->Cell(70, 5, 'Telah ditandatangani secara elektronik', 0, 0, 'C');
                }
            }

            // Save the stamped PDF, overwriting the original or creating a new one
            $pdf->Output('F', $filePath);
            
            // Clean up temporary QR code image
            if (file_exists($qrPath)) {
                unlink($qrPath);
            }

            Log::info("TTE Stamping: QR code successfully applied to {$filePath}");
        } catch (\Exception $e) {
            Log::error("TTE Stamping Failed: " . $e->getMessage());
            // We don't throw to prevent failing the entire signing process if stamping fails
        }
    }
}
