<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('calculation_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->decimal('weight', 5, 2);
            $table->decimal('height', 5, 2);
            $table->integer('age');
            $table->string('gender', 1);
            $table->decimal('bmr', 8, 2);
            $table->decimal('tee', 8, 2);
            $table->json('requirements');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('calculation_histories');
    }
};
