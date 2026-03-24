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
        Schema::create('foods', function (Blueprint $table) {
            $table->id();
            // Optional: Jika data global bawaan sistem, tenant_id = null.
            $table->foreignId('tenant_id')->nullable()->constrained('tenants')->cascadeOnDelete();
            
            $table->string('name');
            $table->string('category')->nullable();
            $table->string('food_group')->nullable();
            $table->string('source')->default('system'); // system, custom, openfoodfacts
            $table->string('barcode')->nullable()->unique();
            $table->text('description')->nullable();

            // Macronutrients (per 100g)
            $table->decimal('energy', 8, 2)->default(0); // kcal
            $table->decimal('protein', 8, 2)->default(0); // g
            $table->decimal('fat', 8, 2)->default(0); // g
            $table->decimal('carbohydrate', 8, 2)->default(0); // g
            $table->decimal('fiber', 8, 2)->default(0); // g
            $table->decimal('sugar', 8, 2)->default(0); // g

            // Micronutrients (per 100g)
            $table->decimal('sodium', 8, 2)->default(0); // mg
            $table->decimal('calcium', 8, 2)->default(0); // mg
            $table->decimal('iron', 8, 2)->default(0); // mg
            $table->decimal('vitamin_a', 8, 2)->default(0); // mcg/IU
            $table->decimal('vitamin_b', 8, 2)->default(0); // mg
            $table->decimal('vitamin_c', 8, 2)->default(0); // mg

            $table->boolean('is_verified')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('foods');
    }
};
