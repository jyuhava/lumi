<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login user with username and password
     */
    public function login(Request $request)
    {
        logger('Login Request: ', $request->all());

        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        // Karena Frontend tidak pakai subdomain, user bisa dari rumah sakit mana saja.
        // Maka kita matikan fungsi filter Isolasi (Global Scope) HANYA untuk proses pencarian user saat Login.
        $user = User::withoutGlobalScopes()->with('tenant')->where('username', $request->username)->first();

        logger('Found User: ', ['user' => $user]);

        if (!$user) {
            logger('User Not Found');
            throw ValidationException::withMessages([
                'username' => ['The provided credentials are incorrect. (User Not Found)'],
            ]);
        }

        if (!Hash::check($request->password, $user->password)) {
            logger('Hash Check Failed');
            throw ValidationException::withMessages([
                'username' => ['The provided credentials are incorrect. (Password Mismatch)'],
            ]);
        }

        // Cek apakah Tenant (Rumah Sakit) user ini sedang diblokir?
        if ($user->tenant && $user->tenant->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak: Akun instansi Anda sedang berstatus suspend/menunggu pembayaran.'
            ], 403);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'email' => $user->email,
                    'tenant_id' => $user->tenant_id,
                    'tenant_subdomain' => $user->tenant->subdomain ?? null
                ],
                'token' => $token,
            ],
        ]);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout successful',
        ]);
    }

    /**
     * Get authenticated user
     */
    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'username' => $request->user()->username,
                    'email' => $request->user()->email,
                ],
            ],
        ]);
    }
}
