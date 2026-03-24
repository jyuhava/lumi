<?php

namespace App\Http\Controllers\CustomerVerApi;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Mobile login endpoint.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string', // Ubah rule agar bisa menerima username atau email
            'password' => 'required',
            'device_name' => 'nullable|string',
        ]);

        // Cek login pakai email ATAU username & Bypass TenantScope karena saat login tenant belum diketahui
        $user = User::withoutGlobalScope(\App\Scopes\TenantScope::class)
                    ->with('tenant')
                    ->where('email', $request->email)
                    ->orWhere('username', $request->email)
                    ->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau Password salah.'
            ], 401);
        }

        // Opsional: Cek jika user ini aktif (jika ada flag is_active di sistem Anda)
        // if (!$user->is_active) { ... }

        $deviceName = $request->device_name ?? 'mobile-app';
        
        // Buat token Sanctum khusus mobile
        $token = $user->createToken($deviceName)->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'tenant' => $user->tenant ? [
                    'id' => $user->tenant->id,
                    'name' => $user->tenant->name,
                ] : null
            ]
        ]);
    }

    /**
     * Get authenticated user info.
     */
    public function me(Request $request)
    {
        // $request->user()->load('tenant'); // Atau ambil user dari auth langsung
        
        $user = User::with('tenant')->find($request->user()->id);

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'tenant' => $user->tenant ? [
                    'id' => $user->tenant->id,
                    'name' => $user->tenant->name,
                    // Tambahkan field tenant lain yg mungkin diperlukan di mobile app (logo, jadwal buka, dll)
                ] : null
            ]
        ]);
    }

    /**
     * Mobile logout endpoint (revoke current token).
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Anda telah berhasil logout.'
        ]);
    }
}
