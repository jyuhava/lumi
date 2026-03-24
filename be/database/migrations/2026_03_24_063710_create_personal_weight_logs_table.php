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
        Schema::create('personal_weight_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('personal_user_id')->constrained('personal_users')->cascadeOnDelete();
            $table->string('local_id')->comment('ID generated locally on device (for dedup)');
            $table->decimal('weight', 5, 2);
            $table->timestamp('recorded_at'); // Original timestamp from device
            $table->timestamps();

            // Prevent duplicate sync of the same local log
            $table->unique(['personal_user_id', 'local_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personal_weight_logs');
    }
};
