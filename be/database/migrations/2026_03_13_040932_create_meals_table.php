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
        Schema::create('meals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            // Tabel pasien dari DBMP/Nutrition Clinic eksisting
            $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
            
            $table->date('date');
            $table->enum('meal_type', ['breakfast', 'lunch', 'dinner', 'snack']);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meals');
    }
};
