<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$user = App\Models\User::first();
Auth::login($user); // Login the user

$request = Illuminate\Http\Request::create('/api/v1/letters/1/sign', 'POST', ['passphrase' => '123456']);
$request->headers->set('Accept', 'application/json');
$response = $kernel->handle($request);

echo $response->getContent();
