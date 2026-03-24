<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\Tenant;
use App\Models\User;
use App\Models\Product;
use App\Services\TenantService;

class DummyTenantSeeder extends Seeder
{
    public function run()
    {
        // ==== BUAT TENANT 2 (Klinik Sehat) ====
        $tenant2 = Tenant::create([
            'name' => 'Klinik Sehat Abadi',
            'subdomain' => 'klinik-sehat',
            'status' => 'active',
            'plan' => 'basic',
            'subscription_ends_at' => now()->addMonths(6)
        ]);
        
        // Simulasikan Request sedang berada di Tenant 2
        TenantService::setTenantId($tenant2->id);

        // Buat User Nakes di Tenant 2
        User::create([
            'tenant_id' => $tenant2->id,
            'name' => 'Dr. Cipto Klinik',
            'username' => 'nakes_klinik',
            'email' => 'dokter@kliniksehat.com',
            'password' => Hash::make('password'),
        ]);

        // Buat Kategori & Produk terisolasi di Tenant 2
        $catId = DB::table('categories')->insertGetId([
            'tenant_id' => $tenant2->id,
            'name' => 'Susu Formula Bayi',
            'description' => 'Khusus Klinik',
            'created_at' => now(),
            'updated_at' => now()
        ]);

        Product::create([
            'tenant_id' => $tenant2->id,
            'category_id' => $catId,
            'code' => 'KLINIK-001',
            'name' => 'Susu Morinaga',
            'price' => 125000,
            'stock' => 50,
            'unit' => 'kaleng'
        ]);

        // ==== BUAT TENANT 3 (DIBLOKIR / SUSPENDED) ====
        $tenant3 = Tenant::create([
            'name' => 'RS Merdeka (Expired)',
            'subdomain' => 'rs-merdeka',
            'status' => 'suspended',
            'plan' => 'premium',
            'subscription_ends_at' => now()->subDays(5)
        ]);

        User::create([
            'tenant_id' => $tenant3->id,
            'name' => 'Nakes Telat Bayar',
            'username' => 'nakes_merdeka',
            'email' => 'telat@rsmerdeka.com',
            'password' => Hash::make('password'),
        ]);
    }
}