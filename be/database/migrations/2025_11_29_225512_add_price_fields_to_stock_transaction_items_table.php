<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('stock_transaction_items', function (Blueprint $table) {
            $table->decimal('unit_price', 15, 2)->default(0)->after('product_id');
            $table->decimal('discount_percent', 5, 2)->default(0)->after('unit_price');
            $table->decimal('discount_amount', 15, 2)->default(0)->after('discount_percent');
            $table->decimal('final_price', 15, 2)->default(0)->after('discount_amount');
            $table->decimal('subtotal', 15, 2)->default(0)->after('quantity');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stock_transaction_items', function (Blueprint $table) {
            $table->dropColumn(['unit_price', 'discount_percent', 'discount_amount', 'final_price', 'subtotal']);
        });
    }
};
