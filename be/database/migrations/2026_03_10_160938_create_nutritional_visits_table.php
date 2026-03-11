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
        Schema::create('nutritional_visits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->onDelete('cascade');
            $table->foreignId('nutritionist_id')->constrained('users')->onDelete('cascade');
            $table->date('visit_date');
            $table->date('admission_date')->nullable();
            $table->string('room_number')->nullable();
            $table->string('medical_diagnosis')->nullable();
            $table->string('diet_prescription')->nullable();
            $table->decimal('weight', 5, 2)->nullable();
            $table->decimal('height', 5, 2)->nullable();
            $table->decimal('bmi', 5, 2)->nullable();
            $table->string('nutritional_status')->nullable();
            $table->string('malnutrition_risk')->nullable();
            $table->text('remarks')->nullable();
            $table->boolean('is_emr_filled')->default(false);
            $table->boolean('is_educated')->default(false);
            $table->boolean('is_care_provided')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nutritional_visits');
    }
};
