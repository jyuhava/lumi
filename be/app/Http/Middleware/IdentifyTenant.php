<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Tenant;
use App\Services\TenantService;

class IdentifyTenant
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Pengecualian rute SaaS / SuperAdmin, tidak perlu tenant context
        if ($request->is('api/saas*')) {
            return $next($request);
        }

        // Pengecualian rute Personal (LumiFit non-nakes) — pakai tabel personal_users sendiri
        if ($request->is('api/personal*')) {
            return $next($request);
        }

        // Pengecualian rute login mobile, karena tenant belum diketahui
        if ($request->is('api/mobile/login') || $request->is('mobile/login')) {
            return $next($request);
        }

        // 1. Check for specific Header for tenant identification
        $tenantSubdomain = $request->header('X-Tenant');

        if (!$tenantSubdomain) {
            // Jika ini rute mobile dan user sudah menggunakan Token Sanctum, ekstrak token secara manual untuk dapat tenant_id
            if ($request->is('api/mobile/*')) {
                $token = $request->bearerToken();
                if ($token) {
                    $accessToken = \Laravel\Sanctum\PersonalAccessToken::findToken($token);
                    if ($accessToken && $accessToken->tokenable_type === 'App\Models\User') {
                        // Bypass TenantScope untuk menemukan User pemilik token
                        $user = \App\Models\User::withoutGlobalScope(\App\Scopes\TenantScope::class)->find($accessToken->tokenable_id);
                        if ($user && $user->tenant_id) {
                            $tenant = \App\Models\Tenant::find($user->tenant_id);
                            if ($tenant && $tenant->status === 'active') {
                                \App\Services\TenantService::setTenantId($tenant->id);
                                $request->merge(['tenant_id' => $tenant->id]);
                                return $next($request);
                            }
                        }
                    }
                }
            }

            return response()->json(['message' => 'Akses ditolak: Identitas Instansi (X-Tenant) tidak ditemukan'], 400);
        }

        $tenant = Tenant::where('subdomain', $tenantSubdomain)->first();

        if (!$tenant) {
            return response()->json(['message' => 'Tenant tidak ditemukan'], 404);
        }

        if ($tenant->status !== 'active') {
            return response()->json(['message' => 'Tenant disuspend. Silakan hubungi admin SaaS'], 403);
        }

        // Set current tenant context
        TenantService::setTenantId($tenant->id);
            
        // Also inject it to the request so controllers can access if needed
        $request->merge(['tenant_id' => $tenant->id]);

        return $next($request);
    }
}
