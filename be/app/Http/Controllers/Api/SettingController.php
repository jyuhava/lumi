<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Get all institution settings
     */
    public function getInstitution()
    {
        $settings = [
            'name' => Setting::get('institution_name', ''),
            'address' => Setting::get('institution_address', ''),
            'phone' => Setting::get('institution_phone', ''),
            'email' => Setting::get('institution_email', ''),
            'logo' => Setting::get('institution_logo', ''),
        ];

        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }

    /**
     * Update institution settings
     */
    public function updateInstitution(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'logo' => 'nullable|string',
        ]);

        Setting::set('institution_name', $validated['name']);
        Setting::set('institution_address', $validated['address'] ?? '');
        Setting::set('institution_phone', $validated['phone'] ?? '');
        Setting::set('institution_email', $validated['email'] ?? '');
        Setting::set('institution_logo', $validated['logo'] ?? '');

        return response()->json([
            'success' => true,
            'message' => 'Pengaturan institusi berhasil diperbarui',
        ]);
    }
}
