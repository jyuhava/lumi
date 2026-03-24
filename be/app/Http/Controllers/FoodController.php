<?php

namespace App\Http\Controllers;

use App\Models\Food;
use App\Services\OpenFoodFactsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FoodController extends Controller
{
    protected $offService;

    public function __construct(OpenFoodFactsService $offService)
    {
        $this->offService = $offService;
    }

    /**
     * Tampilkan list makanan (Lokal/Internal Database).
     */
    public function index(Request $request)
    {
        $query = Food::query();

        // Pencarian nama
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('barcode', 'like', '%' . $request->search . '%');
        }

        // Filter kategori
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        // Filter tinggi protein, dsb (contoh custom filter)
        if ($request->filled('high_protein') && $request->high_protein == 'true') {
            $query->where('protein', '>=', 10); // > 10g protein
        }

        $foods = $query->latest()->paginate($request->get('per_page', 15));

        return response()->json($foods);
    }

    /**
     * Proxy Request Ke Open Food Facts.
     */
    public function searchExternal(Request $request)
    {
        $request->validate([
            'query' => 'required_without:barcode|string',
            'barcode' => 'required_without:query|string',
            'page' => 'nullable|integer',
            'limit' => 'nullable|integer'
        ]);

        if ($request->filled('barcode')) {
            $product = $this->offService->getProductByBarcode($request->barcode);
            if ($product) {
                return response()->json(['product' => $product], 200);
            }
            return response()->json(['message' => 'Product not found on OpenFoodFacts.'], 404);
        }

        $results = $this->offService->searchProducts(
            $request->get('query'), 
            $request->get('page', 1), 
            $request->get('limit', 20)
        );

        return response()->json($results);
    }

    public function searchTkpi(Request $request)
    {
        $query = \Illuminate\Support\Facades\DB::connection('sqlite_pangan')->table('foods');

        if ($request->filled('query')) {
            $query->where('nama', 'like', '%' . $request->input('query') . '%')
                  ->orWhere('kode', 'like', '%' . $request->input('query') . '%');
        }

        $results = $query->paginate($request->get('limit', 15));

        $formatted = collect($results->items())->map(function($item) {
            return [
                'id' => $item->kode, // Use code as ID for frontend table key
                'barcode' => $item->kode,
                'name' => $item->nama,
                'category' => $item->kategori,
                'source' => 'tkpi',
                // Make sure to parse values and default to 0
                'energy' => (float) $item->energi,
                'protein' => (float) $item->protein,
                'fat' => (float) $item->lemak,
                'carbohydrate' => (float) $item->karbohidrat,
                
                // Micro
                'fiber' => (float) $item->serat,
                'sodium' => (float) $item->natrium,
                'calcium' => (float) $item->kalsium,
                'iron' => (float) $item->besi,
                'vitamin_a' => (float) $item->retinol, 
                'vitamin_b' => (float) $item->thiamin, 
                'vitamin_c' => (float) $item->vit_c,
            ];
        });

        return response()->json([
            'data' => $formatted,
            'current_page' => $results->currentPage(),
            'last_page' => $results->lastPage(),
            'total' => $results->total()
        ]);
    }

    /**
     * Simpan Makanan Baru (Custom / Import dari OFF).
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'food_group' => 'nullable|string|max:255',
            'source' => 'nullable|string|in:system,custom,openfoodfacts,tkpi',
            'barcode' => 'nullable|string|unique:foods,barcode',
            // Macronutrients
            'energy' => 'numeric|min:0',
            'protein' => 'numeric|min:0',
            'fat' => 'numeric|min:0',
            'carbohydrate' => 'numeric|min:0',
            // Micronutrients (Optional)
            'fiber' => 'nullable|numeric|min:0',
            'sugar' => 'nullable|numeric|min:0',
            'sodium' => 'nullable|numeric|min:0',
            'calcium' => 'nullable|numeric|min:0',
            'iron' => 'nullable|numeric|min:0',
            'vitamin_a' => 'nullable|numeric|min:0',
            'vitamin_b' => 'nullable|numeric|min:0',
            'vitamin_c' => 'nullable|numeric|min:0',
            'is_verified' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        
        // The model uses Tenantable trait, so tenant_id will be handled automatically.
        // It is removed from manual assignment here to prevent the undefined tenant() function error.
        
        $data['source'] = $data['source'] ?? 'custom';

        $food = Food::create($data);

        return response()->json([
            'message' => 'Food item created successfully.',
            'food' => $food
        ], 201);
    }

    /**
     * Menampilkan 1 Makanan Lokal
     */
    public function show($id)
    {
        $food = Food::findOrFail($id);
        return response()->json($food);
    }

    /**
     * Update Makanan Kustom
     */
    public function update(Request $request, $id)
    {
        $food = Food::findOrFail($id);
        
        // Proteksi: jangan membiarkan tenant ubah makanan global 'system'
        if ($food->tenant_id === null && $food->source === 'system' && !auth()->user()->isSuperAdmin()) {
            return response()->json(['message' => 'Unauthorized to edit system default foods.'], 403);
        }

        $food->update($request->all());

        return response()->json([
            'message' => 'Food updated successfully.',
            'food' => $food
        ]);
    }

    /**
     * Hapus Makanan.
     */
    public function destroy($id)
    {
        $food = Food::findOrFail($id);
        
        if ($food->tenant_id === null && $food->source === 'system' && !auth()->user()->isSuperAdmin()) {
            return response()->json(['message' => 'Unauthorized to delete system default foods.'], 403);
        }
        
        $food->delete();

        return response()->json(['message' => 'Food deleted successfully.']);
    }
}