<?php
require __DIR__.'/be/vendor/autoload.php';
$app = require_once __DIR__.'/be/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::withoutGlobalScopes()->where('username', 'medika')->first();
echo "User exists: " . ($user ? 'Yes' : 'No') . "\n";
if ($user) {
    echo "Hash match: " . (\Illuminate\Support\Facades\Hash::check('sarada000', $user->password) ? 'Yes' : 'No') . "\n";
}
