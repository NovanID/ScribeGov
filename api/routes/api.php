<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\LetterController;
use App\Http\Controllers\Api\V1\InboxController;
use App\Http\Controllers\Api\V1\DispositionController;

Route::prefix('v1')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/auth/magic-link', [AuthController::class, 'magicLink']);

    // Signed routes for file viewing and downloading
    Route::get('letters/{id}/view', [App\Http\Controllers\Api\V1\LetterController::class, 'viewFile'])->name('letters.view')->middleware('signed');
    Route::get('letters/{id}/download', [App\Http\Controllers\Api\V1\LetterController::class, 'download'])->name('letters.download')->middleware('signed');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        
        Route::get('/inbox', [App\Http\Controllers\Api\V1\InboxController::class, 'index']);
        
        Route::get('/user', [App\Http\Controllers\Api\V1\AdminUserController::class, 'getCurrentUser']);
        Route::get('/admin/users', [App\Http\Controllers\Api\V1\AdminUserController::class, 'index']);
        Route::put('/admin/tte-passphrase', [App\Http\Controllers\Api\V1\AdminUserController::class, 'updateOwnTtePassphrase']);
        
        Route::post('letters/ocr', [App\Http\Controllers\Api\V1\OcrController::class, 'scan']);
        Route::post('letters/batch-sign', [App\Http\Controllers\Api\V1\SignatureController::class, 'batchSign']);
        Route::post('letters/{id}/sign', [App\Http\Controllers\Api\V1\SignatureController::class, 'sign']);
        Route::apiResource('letters', App\Http\Controllers\Api\V1\LetterController::class);

        Route::get('dispositions/users', [App\Http\Controllers\Api\V1\DispositionController::class, 'getUsersGroupedByOrg']);
        Route::post('dispositions', [App\Http\Controllers\Api\V1\DispositionController::class, 'store']);
        Route::get('dispositions/suggest', [DispositionController::class, 'suggest']);
        Route::get('letters/{id}/timeline', [DispositionController::class, 'timeline']);

        Route::post('letters/{id}/sign', [App\Http\Controllers\Api\V1\SignatureController::class, 'sign']);
    });
});
