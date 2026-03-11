<?php
namespace App\Http\Controllers;

use App\Models\NutritionalVisit;
use App\Models\Patient;
use Illuminate\Http\Request;

class NutritionalVisitController extends Controller
{
    public function index(Request $request)
    {
        $query = NutritionalVisit::with(['patient', 'nutritionist']);
        if ($request->filled('month')) $query->whereMonth('visit_date', $request->month);
        if ($request->filled('year')) $query->whereYear('visit_date', $request->year);
        return response()->json($query->orderBy('visit_date', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'no_rm' => 'required|string',
            'name' => 'required|string',
            'age' => 'nullable|integer',
            'gender' => 'nullable|in:L,P',
            'visit_date' => 'required|date',
            'admission_date' => 'nullable|date',
            'room_number' => 'nullable|string',
            'medical_diagnosis' => 'nullable|string',
            'diet_prescription' => 'nullable|string',
            'weight' => 'nullable|numeric',
            'height' => 'nullable|numeric',
            'bmi' => 'nullable|numeric',
            'nutritional_status' => 'nullable|string',
            'malnutrition_risk' => 'nullable|string',
            'remarks' => 'nullable|string',
            'is_emr_filled' => 'boolean',
            'is_educated' => 'boolean',
            'is_care_provided' => 'boolean',
        ]);

        $patient = Patient::firstOrCreate(
            ['no_rm' => $validated['no_rm']],
            ['name' => $validated['name'], 'age' => $validated['age'] ?? null, 'gender' => $validated['gender'] ?? null]
        );

        $visitData = collect($validated)->except(['no_rm', 'name', 'age', 'gender'])->toArray();
        $visit = NutritionalVisit::create(array_merge($visitData, [
            'patient_id' => $patient->id,
            'nutritionist_id' => auth()->id() ?? 1,
        ]));

        return response()->json($visit->load(['patient', 'nutritionist']), 201);
    }
}
