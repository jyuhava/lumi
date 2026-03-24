<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Helper khusus karena tabel Settings memakai key-value
     */
    private function getSetting($key, $default = '')
    {
        $setting = Setting::where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }

    private function setSetting($key, $value)
    {
        Setting::updateOrCreate(
            ['key' => $key], // Kondisi (disertai global scope tenant implicit)
            ['value' => $value] 
        );
    }

    /**
     * Get all institution settings
     */
    public function getInstitution()
    {
        $settings = [
            'name' => $this->getSetting('institution_name', ''),
            'address' => $this->getSetting('institution_address', ''),
            'phone' => $this->getSetting('institution_phone', ''),
            'email' => $this->getSetting('institution_email', ''),
            'logo' => $this->getSetting('institution_logo', ''),
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

        $this->setSetting('institution_name', $validated['name']);
        $this->setSetting('institution_address', $validated['address'] ?? '');
        $this->setSetting('institution_phone', $validated['phone'] ?? '');
        $this->setSetting('institution_email', $validated['email'] ?? '');
        $this->setSetting('institution_logo', $validated['logo'] ?? '');

        return response()->json([
            'success' => true,
            'message' => 'Pengaturan institusi berhasil diperbarui',
        ]);
    }
}
