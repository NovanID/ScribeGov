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

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        
        Route::get('/inbox', [App\Http\Controllers\Api\V1\InboxController::class, 'index']);
        
        Route::post('letters/ocr', [App\Http\Controllers\Api\V1\OcrController::class, 'scan']);
        Route::post('letters/batch-sign', [App\Http\Controllers\Api\V1\SignatureController::class, 'batchSign']);
        Route::post('letters/{id}/sign', [App\Http\Controllers\Api\V1\SignatureController::class, 'sign']);
        Route::apiResource('letters', App\Http\Controllers\Api\V1\LetterController::class);

        Route::post('dispositions', [App\Http\Controllers\Api\V1\DispositionController::class, 'store']);
        Route::get('dispositions/suggest', [DispositionController::class, 'suggest']);
        Route::get('letters/{id}/timeline', [DispositionController::class, 'timeline']);

        Route::post('letters/{id}/sign', [App\Http\Controllers\Api\V1\SignatureController::class, 'sign']);
    });
});
