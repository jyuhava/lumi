<?php
namespace App\Http\Controllers\SaaS;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Services\TenantService;

class TenantController extends Controller
{
    public function index()
    {
        $tenants = Tenant::orderBy('created_at', 'desc')->get();
        $stats = [
            'total_tenants' => Tenant::count(),
            'active_tenants' => Tenant::where('status', 'active')->count(),
            'total_users' => User::withoutGlobalScopes()->count(),
            'estimated_mrr' => (Tenant::where('plan', 'premium')->where('status', 'active')->count() * 2500000) + 
                               (Tenant::where('plan', 'basic')->where('status', 'active')->count() * 1000000)
        ];
        return response()->json(['data' => $tenants, 'stats' => $stats]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'subdomain' => 'required|string|alpha_dash|unique:tenants,subdomain',
            'plan' => ['required', Rule::in(['basic', 'premium', 'enterprise'])],
            'status' => ['required', Rule::in(['active', 'suspended'])],
            
            // Kolom untuk Akun Perdana:
            'pic_name' => 'required|string|max:255',
            'pic_username' => 'required|string|max:255|unique:users,username',
            'pic_email' => 'required|email|max:255|unique:users,email',
            'pic_password' => 'required|string|min:6',
        ]);

        DB::beginTransaction();
        try {
            $tenantData = [
                'name' => $validated['name'],
                'subdomain' => $validated['subdomain'],
                'plan' => $validated['plan'],
                'status' => $validated['status'],
                'subscription_ends_at' => now()->addYear()
            ];

            $tenant = Tenant::create($tenantData);

            TenantService::setTenantId($tenant->id);

            $user = User::create([
                'tenant_id' => $tenant->id,
                'name' => $validated['pic_name'],
                'username' => $validated['pic_username'],
                'email' => $validated['pic_email'],
                'password' => Hash::make($validated['pic_password']),
            ]);

            // Set default institution name in settings
            \App\Models\Setting::create([
                'tenant_id' => $tenant->id,
                'key' => 'institution_name',
                'value' => $tenant->name
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Tenant dan Akun PIC berhasil didaftarkan!',
                'data' => $tenant
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Gagal mendaftarkan tenant: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $tenant = Tenant::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'subdomain' => ['sometimes','string','alpha_dash', Rule::unique('tenants')->ignore($tenant->id)],
            'plan' => ['sometimes', Rule::in(['basic', 'premium', 'enterprise'])],
            'status' => ['sometimes', Rule::in(['active', 'suspended'])],
        ]);

        $tenant->update($validated);

        return response()->json([
            'message' => 'Tenant berhasil diupdate',
            'data' => $tenant
        ]);
    }

    public function toggleStatus($id)
    {
        $tenant = Tenant::findOrFail($id);
        $tenant->status = $tenant->status === 'active' ? 'suspended' : 'active';
        $tenant->save();

        return response()->json([
            'message' => 'Status tenant diubah menjadi ' . $tenant->status,
            'data' => $tenant
        ]);
    }

    public function destroy($id)
    {
        $tenant = Tenant::findOrFail($id);
        $tenant->delete();
        return response()->json(['message' => 'Tenant berhasil dihapus']);
    }
}