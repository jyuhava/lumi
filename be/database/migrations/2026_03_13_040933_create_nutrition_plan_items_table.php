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
        Schema::create('nutrition_plan_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('plan_id')->constrained('nutrition_plans')->cascadeOnDelete();
            $table->foreignId('food_id')->constrained('foods')->cascadeOnDelete();
            
            $table->string('day_of_week')->nullable(); // Monday, Tuesday, etc. Atau bisa berupa index 1-7.
            $table->enum('meal_type', ['breakfast', 'lunch', 'dinner', 'snack']);
            $table->decimal('quantity', 8, 2)->default(0); // in grams (g)
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nutrition_plan_items');
    }
};
