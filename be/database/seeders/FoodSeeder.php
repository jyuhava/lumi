<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FoodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $foods = [
            [
                'name' => 'Nasi Putih',
                'category' => 'Makanan Pokok',
                'food_group' => 'Padi-padian',
                'source' => 'system',
                'barcode' => null,
                'description' => 'Nasi putih matang',
                'energy' => 130, // kcal per 100g
                'protein' => 2.7,
                'fat' => 0.3,
                'carbohydrate' => 28.2,
                'fiber' => 0.4,
                'sugar' => 0.1,
                'sodium' => 1,
                'calcium' => 10,
                'iron' => 0.2,
                'vitamin_a' => 0,
                'vitamin_b' => 0,
                'vitamin_c' => 0,
                'is_verified' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Dada Ayam Rebus',
                'category' => 'Lauk Pauk',
                'food_group' => 'Daging',
                'source' => 'system',
                'barcode' => null,
                'description' => 'Dada ayam tanpa kulit, direbus',
                'energy' => 165,
                'protein' => 31,
                'fat' => 3.6,
                'carbohydrate' => 0,
                'fiber' => 0,
                'sugar' => 0,
                'sodium' => 74,
                'calcium' => 15,
                'iron' => 1,
                'vitamin_a' => 21,
                'vitamin_b' => 0.6,
                'vitamin_c' => 0,
                'is_verified' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Tempe Goreng',
                'category' => 'Lauk Pauk',
                'food_group' => 'Kacang-kacangan',
                'source' => 'system',
                'barcode' => null,
                'description' => 'Tempe kedelai murni, digoreng',
                'energy' => 336,
                'protein' => 20,
                'fat' => 25,
                'carbohydrate' => 13,
                'fiber' => 7,
                'sugar' => 0.5,
                'sodium' => 15,
                'calcium' => 130,
                'iron' => 2.5,
                'vitamin_a' => 0,
                'vitamin_b' => 0.2,
                'vitamin_c' => 0,
                'is_verified' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Bayam Rebus',
                'category' => 'Sayuran',
                'food_group' => 'Sayuran Daun Hijau',
                'source' => 'system',
                'barcode' => null,
                'description' => 'Bayam hijau basah rebus tanpa garam',
                'energy' => 23,
                'protein' => 3,
                'fat' => 0.3,
                'carbohydrate' => 3.8,
                'fiber' => 2.4,
                'sugar' => 0.4,
                'sodium' => 70,
                'calcium' => 136,
                'iron' => 3.6,
                'vitamin_a' => 524, // approx IU
                'vitamin_b' => 0.2,
                'vitamin_c' => 9.8,
                'is_verified' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Pisang Ambon',
                'category' => 'Buah',
                'food_group' => 'Buah-buahan',
                'source' => 'system',
                'barcode' => null,
                'description' => 'Pisang segar ukuran sedang',
                'energy' => 89,
                'protein' => 1.1,
                'fat' => 0.3,
                'carbohydrate' => 22.8,
                'fiber' => 2.6,
                'sugar' => 12.2,
                'sodium' => 1,
                'calcium' => 5,
                'iron' => 0.3,
                'vitamin_a' => 64,
                'vitamin_b' => 0.4,
                'vitamin_c' => 8.7,
                'is_verified' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];

        DB::table('foods')->insert($foods);
    }
}
