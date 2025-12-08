<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\StockTransaction;
use App\Models\StockTransactionItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockTransactionController extends Controller
{
    /**
     * Display a listing of stock transactions with filters
     */
    public function index(Request $request)
    {
        $query = StockTransaction::with(['supplier', 'user', 'items.product']);

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filter by date range
        if ($request->has('start_date')) {
            $query->where('transaction_date', '>=', $request->start_date);
        }
        if ($request->has('end_date')) {
            $query->where('transaction_date', '<=', $request->end_date);
        }

        $transactions = $query->orderBy('transaction_date', 'desc')
                             ->orderBy('created_at', 'desc')
                             ->get();

        return response()->json([
            'success' => true,
            'data' => $transactions,
        ]);
    }

    /**
     * Store a new stock transaction (purchase or usage)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:in,out',
            'transaction_date' => 'required|date',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'nullable|numeric|min:0',
            'items.*.discount_percent' => 'nullable|numeric|min:0|max:100',
        ]);

        try {
            DB::beginTransaction();

            // Generate transaction number
            $prefix = $validated['type'] === 'in' ? 'IN' : 'OUT';
            $date = date('Ymd');
            $lastTransaction = StockTransaction::where('transaction_number', 'like', $prefix . $date . '%')
                                              ->orderBy('transaction_number', 'desc')
                                              ->first();
            
            if ($lastTransaction) {
                $lastNumber = intval(substr($lastTransaction->transaction_number, -4));
                $newNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
            } else {
                $newNumber = '0001';
            }
            
            $transactionNumber = $prefix . $date . $newNumber;

            $totalAmount = 0;

            // Create transaction
            $transaction = StockTransaction::create([
                'transaction_number' => $transactionNumber,
                'type' => $validated['type'],
                'transaction_date' => $validated['transaction_date'],
                'supplier_id' => $validated['supplier_id'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'user_id' => auth()->id(),
                'total_amount' => 0, // Will update after processing items
            ]);

            // Process items and update stock
            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                $stockBefore = $product->stock;
                
                // Calculate new stock
                if ($validated['type'] === 'in') {
                    $stockAfter = $stockBefore + $item['quantity'];
                } else {
                    $stockAfter = $stockBefore - $item['quantity'];
                    
                    // Prevent negative stock
                    if ($stockAfter < 0) {
                        DB::rollBack();
                        return response()->json([
                            'success' => false,
                            'message' => "Stok produk {$product->name} tidak mencukupi. Stok saat ini: {$stockBefore}",
                        ], 400);
                    }
                }

                // Calculate price (only for purchase/in transactions)
                $unitPrice = 0;
                $discountPercent = 0;
                $discountAmount = 0;
                $finalPrice = 0;
                $subtotal = 0;

                if ($validated['type'] === 'in') {
                    // Use custom price if provided, otherwise use product price
                    $unitPrice = $item['unit_price'] ?? $product->price;
                    $discountPercent = $item['discount_percent'] ?? 0;
                    
                    // Calculate discount amount
                    $discountAmount = ($unitPrice * $discountPercent) / 100;
                    
                    // Calculate final price after discount
                    $finalPrice = $unitPrice - $discountAmount;
                    
                    // Calculate subtotal
                    $subtotal = $finalPrice * $item['quantity'];
                    
                    // Add to total amount
                    $totalAmount += $subtotal;
                }

                // Create transaction item
                StockTransactionItem::create([
                    'stock_transaction_id' => $transaction->id,
                    'product_id' => $product->id,
                    'unit_price' => $unitPrice,
                    'discount_percent' => $discountPercent,
                    'discount_amount' => $discountAmount,
                    'final_price' => $finalPrice,
                    'quantity' => $item['quantity'],
                    'subtotal' => $subtotal,
                    'stock_before' => $stockBefore,
                    'stock_after' => $stockAfter,
                ]);

                // Update product stock
                $product->update(['stock' => $stockAfter]);
            }

            // Update transaction total_amount
            $transaction->update(['total_amount' => $totalAmount]);

            DB::commit();

            // Load relationships for response
            $transaction->load(['supplier', 'user', 'items.product']);

            return response()->json([
                'success' => true,
                'message' => 'Transaksi berhasil disimpan',
                'data' => $transaction,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan transaksi: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified transaction
     */
    public function show(string $id)
    {
        $transaction = StockTransaction::with(['supplier', 'user', 'items.product'])
                                       ->find($id);

        if (!$transaction) {
            return response()->json([
                'success' => false,
                'message' => 'Transaksi tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $transaction,
        ]);
    }

    /**
     * Get current stock summary
     */
    public function stockSummary()
    {
        $products = Product::with('category')
                          ->select('id', 'code', 'name', 'stock', 'unit', 'price', 'category_id')
                          ->get();

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }
}
