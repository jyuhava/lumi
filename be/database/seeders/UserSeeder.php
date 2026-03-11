<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['username' => 'admin'],
            [
                'name' => 'Admin',
                'email' => 'admin@example.com',
                'password' => Hash::make('admin123'),
            ]
        );

        User::updateOrCreate(
            ['username' => 'admin_lumine'],
            [
                'name' => 'Admin Lumine',
                'email' => 'admin@lumineid.com',
                'password' => Hash::make('admin461713'),
            ]
        );
    }
}
