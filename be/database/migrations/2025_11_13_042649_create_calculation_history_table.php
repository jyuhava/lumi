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
        Schema::create('calculation_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('calculator_type'); // 'nutrition', 'bmi', 'lila', etc
            $table->string('method'); // 'harris-benedict', 'mifflin', 'broca', etc
            $table->json('inputs'); // Data input (BB, TB, usia, dll)
            $table->json('results'); // Hasil perhitungan
            $table->text('notes')->nullable(); // Catatan tambahan
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('calculation_history');
    }
};
