<?php

$models_dir = __DIR__ . '/app/Models';
$files = glob($models_dir . '/*.php');

$exclude = ['Tenant.php', 'SysAdmin.php'];

foreach ($files as $file) {
    $filename = basename($file);
    if (in_array($filename, $exclude)) continue;

    $content = file_get_contents($file);
    
    // Skip if already has Tenantable
    if (strpos($content, 'use \App\Traits\Tenantable;') !== false || strpos($content, 'use App\Traits\Tenantable;') !== false) {
        continue;
    }

    // Insert trait inside the class
    $content = preg_replace('/(class\s+[a-zA-Z0-9_]+\s+extends\s+[a-zA-Z0-9_]+\s*\{)/', "$1\n    use \App\Traits\Tenantable;\n", $content);
    
    file_put_contents($file, $content);
    echo "Patched $filename\n";
}
