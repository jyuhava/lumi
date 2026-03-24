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
        Schema::create('personal_activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('personal_user_id')->constrained('personal_users')->cascadeOnDelete();
            $table->string('local_id')->comment('Device-generated ID for dedup');
            $table->enum('entry_type', ['manual', 'tracking']);
            $table->string('activity_type', 30); // walking, running, etc.
            $table->string('name', 100);
            $table->unsignedInteger('steps')->default(0);
            $table->unsignedInteger('duration')->default(0)->comment('seconds');
            $table->decimal('distance', 8, 2)->default(0)->comment('metres');
            $table->decimal('calories', 8, 2)->default(0);
            $table->timestamp('recorded_at');
            $table->timestamps();

            $table->unique(['personal_user_id', 'local_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personal_activity_logs');
    }
};
