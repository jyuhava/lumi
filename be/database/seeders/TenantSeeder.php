<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Tenant;

class TenantSeeder extends Seeder
{
    public function run()
    {
        $tenant = Tenant::create([
            'name' => 'RS Pelita Harapan',
            'subdomain' => 'rs-pelita',
            'status' => 'active',
            'plan' => 'premium',
            'subscription_ends_at' => now()->addYear()
        ]);

        $tables = ['users','categories','products','suppliers','employees','leave_requests','schedules','settings','shifts','stock_transactions','stock_transaction_items','calculation_history','patients','nutritional_visits','diets'];

        foreach ($tables as $table) {
            DB::table($table)->update(['tenant_id' => $tenant->id]);
        }
    }
}
