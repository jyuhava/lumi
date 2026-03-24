<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Patient;
use App\Models\NutritionalVisit;

class NutritionRequirementController extends Controller
{
    /**
     * Menghitung kebutuhan kalori (Mifflin-St Jeor) dan Makro
     */
    public function calculate(Request $request)
    {
        $request->validate([
            'patient_id' => 'nullable|exists:patients,id',
            'weight' => 'required|numeric|min:1', // kg
            'height' => 'required|numeric|min:1', // cm
            'age' => 'required|integer|min:0', // thn
            'gender' => 'required|in:L,P', // L/P
            'activity_factor' => 'required|numeric|min:1.0', // 1.2, 1.375, 1.55, dll
            'stress_factor' => 'nullable|numeric|min:1.0' // 1.1, 1.2 dll untuk klinis
        ]);

        $w = $request->weight;
        $h = $request->height;
        $a = $request->age;
        $gender = $request->gender;
        $af = $request->activity_factor;
        $sf = $request->stress_factor ?? 1.0;

        // BMR Mifflin-St Jeor
        if ($gender === 'L') {
            $bmr = (10 * $w) + (6.25 * $h) - (5 * $a) + 5;
        } else {
            $bmr = (10 * $w) + (6.25 * $h) - (5 * $a) - 161;
        }

        // Total Energy Expenditure
        $tee = $bmr * $af * $sf;

        // Distribusi Makro Dasar (Standar: Karbo 60%, Protein 15%, Lemak 25%)
        $carbo = ($tee * 0.60) / 4;   // 1g karbo = 4 kkal
        $protein = ($tee * 0.15) / 4; // 1g protein = 4 kkal
        $fat = ($tee * 0.25) / 9;     // 1g lemak = 9 kkal

        // Estimasi Kebutuhan Air (Fluid: Holliday-Segar atau basic 30-35ml/kg)
        $fluid = $w * 35; // approx ml

        // Simpan riwayat jika ada patient_id
        if ($request->filled('patient_id')) {
            \App\Models\CalculationHistory::create([
                'tenant_id' => tenant('id') ?? 1,
                'patient_id' => $request->patient_id,
                'weight' => $w,
                'height' => $h,
                'age' => $a,
                'gender' => $gender,
                'bmr' => round($bmr),
                'tee' => round($tee),
                'requirements' => [
                    'energy' => round($tee),
                    'carbohydrate' => round($carbo),
                    'protein' => round($protein),
                    'fat' => round($fat),
                    'fluid' => round($fluid),
                    'fiber' => 30, // Standar umum gram
                    'sodium' => 2000, // Standar referensi
                    'sugar' => round(($tee * 0.10) / 4), // max 10%
                    'calcium' => 1000 // approx standar mg
                ]
            ]);
        }

        // Return hasil
        return response()->json([
            'bmr' => round($bmr),
            'tee' => round($tee),
            'requirements' => [
                'energy' => round($tee),
                'carbohydrate' => round($carbo),
                'protein' => round($protein),
                'fat' => round($fat),
                'fluid' => round($fluid),
                'fiber' => 30, // Standar umum gram
                'sodium' => 2000, // Standar mg
                'sugar' => round(($tee * 0.10) / 4), // max 10%
                'calcium' => 1000 // approx standar mg
            ]
        ]);
    }

    /**
     * Get target dari visit gizi terakhir
     */
    public function getLatestTarget(Request $request, $patientId)
    {
        $visit = NutritionalVisit::where('patient_id', $patientId)
                    ->orderBy('visit_date', 'desc')
                    ->first();

        if ($visit && $visit->weight && $visit->height) {
            $patient = Patient::find($patientId);
            return response()->json([
                'available' => true,
                'weight' => $visit->weight,
                'height' => $visit->height,
                'age' => $patient->age ?? 30,
                'gender' => $patient->gender ?? 'L',
                'visit_date' => $visit->visit_date
            ]);
        }

        return response()->json(['available' => false]);
    }
}
