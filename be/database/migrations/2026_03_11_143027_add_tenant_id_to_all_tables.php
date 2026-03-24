<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected $tables = [
        'users',
        'categories',
        'products',
        'suppliers',
        'employees',
        'leave_requests',
        'schedules',
        'settings',
        'shifts',
        'stock_transactions',
        'stock_transaction_items',
        'calculation_history',
        'patients',
        'nutritional_visits',
        'diets'
    ];

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        foreach ($this->tables as $tableName) {
            if (Schema::hasTable($tableName)) {
                Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                    if (!Schema::hasColumn($tableName, 'tenant_id')) {
                        $table->foreignId('tenant_id')->nullable()->constrained('tenants')->cascadeOnDelete();
                    }
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        foreach ($this->tables as $tableName) {
            if (Schema::hasTable($tableName)) {
                Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                    if (Schema::hasColumn($tableName, 'tenant_id')) {
                        $table->dropForeign(['tenant_id']);
                        $table->dropColumn('tenant_id');
                    }
                });
            }
        }
    }
};
