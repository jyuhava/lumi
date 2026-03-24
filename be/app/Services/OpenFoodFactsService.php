<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OpenFoodFactsService
{
    protected $baseUrl = 'https://world.openfoodfacts.org/api/v2';
    
    /**
     * Cari produk berdasar barcode
     */
    public function getProductByBarcode(string $barcode)
    {
        try {
            $response = Http::timeout(10)->get("{$this->baseUrl}/product/{$barcode}.json");
            
            if ($response->successful() && $response->json('status') === 1) {
                return $this->formatProductData($response->json('product'));
            }
            
            return null;
        } catch (\Exception $e) {
            Log::error("OpenFoodFacts Error (Barcode: {$barcode}): " . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Cari produk berdasar nama/keyword
     */
    public function searchProducts(string $query, int $page = 1, int $pageSize = 20)
    {
        try {
            $searchUrl = "https://world.openfoodfacts.org/cgi/search.pl";
            
            $response = Http::timeout(15)->get($searchUrl, [
                'search_terms' => $query,
                'search_simple' => 1,
                'action' => 'process',
                'json' => 1,
                'page' => $page,
                'page_size' => $pageSize,
                'fields' => 'product_name,categories,nutriments,code,quantity,image_url,brands'
            ]);
            
            if ($response->successful() && isset($response->json()['products'])) {
                $products = collect($response->json()['products'])->map(function ($product) {
                    return $this->formatProductData($product);
                })->filter(function($item) {
                    return $item['energy'] > 0 || $item['protein'] > 0 || $item['carbohydrate'] > 0;
                })->values();
                
                return [
                    'count' => $response->json()['count'] ?? 0,
                    'page' => $page,
                    'products' => $products
                ];
            }
            
            return ['count' => 0, 'page' => $page, 'products' => []];
        } catch (\Exception $e) {
            Log::error("OpenFoodFacts Search Error (Query: {$query}): " . $e->getMessage());
            return ['count' => 0, 'page' => $page, 'products' => []];
        }
    }

    /**
     * Format raw array dari OFF menjadi struktur array yg match dgn DB Foods kita
     */
    protected function formatProductData(array $product): array
    {
        $nutriments = $product['nutriments'] ?? [];
        
        $energy = $nutriments['energy-kcal_100g'] ?? $nutriments['energy_100g'] ?? 0;
        $protein = $nutriments['proteins_100g'] ?? 0;
        $fat = $nutriments['fat_100g'] ?? 0;
        $carbo = $nutriments['carbohydrates_100g'] ?? 0;
        
        $isVerified = ($energy > 0 || $protein > 0 || $fat > 0 || $carbo > 0);

        return [
            'name' => $product['product_name'] ?? 'Unknown Product',
            'category' => substr($product['categories'] ?? 'General', 0, 255),
            'food_group' => substr($product['brands'] ?? 'OpenFoodFacts', 0, 255),
            'source' => 'openfoodfacts',
            'barcode' => $product['code'] ?? null,
            'description' => substr($product['quantity'] ?? '', 0, 255),
            
            // Makro
            'energy' => (float) $energy,
            'protein' => (float) $protein,
            'fat' => (float) $fat,
            'carbohydrate' => (float) $carbo,
            'fiber' => (float) ($nutriments['fiber_100g'] ?? 0),
            'sugar' => (float) ($nutriments['sugars_100g'] ?? 0),
            
            // Mikro
            'sodium' => (float) (($nutriments['sodium_100g'] ?? 0) * 1000),
            'calcium' => (float) (($nutriments['calcium_100g'] ?? 0) * 1000),
            'iron' => (float) (($nutriments['iron_100g'] ?? 0) * 1000),
            'vitamin_a' => (float) (($nutriments['vitamin-a_100g'] ?? 0) * 1000000),
            'vitamin_b' => (float) (($nutriments['vitamin-b6_100g'] ?? 0) * 1000),
            'vitamin_c' => (float) (($nutriments['vitamin-c_100g'] ?? 0) * 1000),
            
            'is_verified' => $isVerified,
            'image_url' => $product['image_url'] ?? null,
        ];
    }
}
