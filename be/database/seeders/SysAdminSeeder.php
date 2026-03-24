<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\SysAdmin;

class SysAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        SysAdmin::create([
            'name' => 'Wibi SaaS Master',
            'email' => 'admin@lumine.com',
            'password' => Hash::make('admin123')
        ]);
    }
}
