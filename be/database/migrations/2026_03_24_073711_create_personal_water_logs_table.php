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
        Schema::create('personal_water_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('personal_user_id')->constrained('personal_users')->onDelete('cascade');
            $table->string('local_id');
            $table->integer('amount_ml');
            $table->dateTime('recorded_at');
            $table->timestamps();

            $table->unique(['personal_user_id', 'local_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personal_water_logs');
    }
};
