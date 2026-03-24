<?php

namespace App\Http\Controllers\SaaS;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SysAdmin;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $admin = SysAdmin::where('email', $request->email)->first();

        if (! $admin || ! Hash::check($request->password, $admin->password)) {
            throw ValidationException::withMessages([
                'email' => ['Kredensial tidak valid.'],
            ]);
        }

        $token = $admin->createToken('saas_admin_token', ['superadmin'])->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'user' => $admin,
            'token' => $token
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil'
        ]);
    }
}