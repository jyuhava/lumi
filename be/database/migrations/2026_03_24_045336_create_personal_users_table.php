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
        Schema::create('personal_users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            // Profile fields (synced from local store after register)
            $table->enum('gender', ['Male', 'Female'])->nullable();
            $table->date('birth_date')->nullable();
            $table->unsignedSmallInteger('height_cm')->nullable();
            $table->decimal('weight_kg', 5, 2)->nullable();
            $table->enum('blood_type', ['A', 'B', 'AB', 'O'])->nullable();
            $table->string('activity_level')->nullable(); // e.g. "1.55"
            $table->decimal('target_weight_kg', 5, 2)->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personal_users');
    }
};
