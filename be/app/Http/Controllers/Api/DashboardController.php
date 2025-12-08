<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\StockTransaction;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats()
    {
        // Count totals
        $totalProducts = Product::count();
        $totalCategories = Category::count();
        $totalSuppliers = Supplier::count();
        
        // Calculate total stock value
        $totalStockValue = Product::sum(DB::raw('stock * price'));
        
        // Get low stock products (stock <= 10)
        $lowStockCount = Product::where('stock', '<=', 10)->count();
        
        // Get recent transactions (last 10)
        $recentTransactions = StockTransaction::with(['supplier', 'user', 'items.product'])
            ->orderBy('transaction_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
        
        // Get monthly purchase stats (last 6 months)
        $monthlyPurchases = StockTransaction::where('type', 'in')
            ->where('transaction_date', '>=', now()->subMonths(6))
            ->select(
                DB::raw('DATE_FORMAT(transaction_date, "%Y-%m") as month'),
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(total_amount) as total')
            )
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();
        
        // Get monthly usage stats (last 6 months)
        $monthlyUsage = StockTransaction::where('type', 'out')
            ->where('transaction_date', '>=', now()->subMonths(6))
            ->select(
                DB::raw('DATE_FORMAT(transaction_date, "%Y-%m") as month'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();
        
        // Get top products by stock value
        $topProducts = Product::with('category')
            ->select('id', 'code', 'name', 'stock', 'price', 'unit', 'category_id')
            ->orderByRaw('stock * price DESC')
            ->limit(5)
            ->get()
            ->map(function ($product) {
                $product->stock_value = $product->stock * $product->price;
                return $product;
            });
        
        return response()->json([
            'success' => true,
            'data' => [
                'totals' => [
                    'products' => $totalProducts,
                    'categories' => $totalCategories,
                    'suppliers' => $totalSuppliers,
                    'stock_value' => $totalStockValue,
                    'low_stock' => $lowStockCount,
                ],
                'recent_transactions' => $recentTransactions,
                'monthly_purchases' => $monthlyPurchases,
                'monthly_usage' => $monthlyUsage,
                'top_products' => $topProducts,
            ],
        ]);
    }
}
