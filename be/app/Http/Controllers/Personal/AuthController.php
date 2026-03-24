<?php

namespace App\Http\Controllers\Personal;

use App\Http\Controllers\Controller;
use App\Models\PersonalUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/**
 * AuthController untuk pengguna pribadi LumiFit (non-nakes).
 * Endpoint: /api/personal/*
 */
class AuthController extends Controller
{
    // ── Register ──────────────────────────────────────────────────────────────

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name'                  => 'required|string|max:100',
            'email'                 => 'required|email|unique:personal_users,email',
            'password'              => 'required|string|min:8|confirmed',
            // Optional profile fields (can be synced from local store)
            'gender'                => 'nullable|in:Male,Female',
            'birth_date'            => 'nullable|date',
            'height_cm'             => 'nullable|integer|min:50|max:300',
            'weight_kg'             => 'nullable|numeric|min:10|max:500',
            'blood_type'            => 'nullable|in:A,B,AB,O',
            'activity_level'        => 'nullable|string|max:10',
            'target_weight_kg'      => 'nullable|numeric|min:10|max:500',
        ]);

        $user = PersonalUser::create([
            ...$validated,
            'password' => Hash::make($validated['password']),
        ]);

        $token = $user->createToken('lumifit-personal')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Registrasi berhasil. Selamat datang di LumiFit!',
            'token'   => $token,
            'user'    => $this->formatUser($user),
        ], 201);
    }

    // ── Login ─────────────────────────────────────────────────────────────────

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = PersonalUser::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password salah.',
            ], 401);
        }

        // Revoke previous tokens to keep only one active session per device
        $user->tokens()->delete();
        $token = $user->createToken('lumifit-personal')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil.',
            'token'   => $token,
            'user'    => $this->formatUser($user),
        ]);
    }

    // ── Me ────────────────────────────────────────────────────────────────────

    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'user'    => $this->formatUser($request->user()),
        ]);
    }

    // ── Update Profile ────────────────────────────────────────────────────────

    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'name'                  => 'sometimes|required|string|max:100',
            'gender'                => 'nullable|in:Male,Female',
            'birth_date'            => 'nullable|date',
            'height_cm'             => 'nullable|integer|min:50|max:300',
            'weight_kg'             => 'nullable|numeric|min:10|max:500',
            'blood_type'            => 'nullable|in:A,B,AB,O',
            'activity_level'        => 'nullable|string|max:10',
            'target_weight_kg'      => 'nullable|numeric|min:10|max:500',
        ]);

        $user = $request->user();
        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profil berhasil diperbarui.',
            'user'    => $this->formatUser($user),
        ]);
    }

    // ── Logout ────────────────────────────────────────────────────────────────

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Berhasil logout.',
        ]);
    }

    // ── Helper ────────────────────────────────────────────────────────────────

    private function formatUser(PersonalUser $user): array
    {
        return [
            'id'               => $user->id,
            'name'             => $user->name,
            'email'            => $user->email,
            'gender'           => $user->gender,
            'birth_date'       => $user->birth_date?->toDateString(),
            'height_cm'        => $user->height_cm,
            'weight_kg'        => $user->weight_kg,
            'blood_type'       => $user->blood_type,
            'activity_level'   => $user->activity_level,
            'target_weight_kg' => $user->target_weight_kg,
        ];
    }
}
