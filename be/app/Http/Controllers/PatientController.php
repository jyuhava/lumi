<?php
namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PatientController extends Controller
{
    /**
     * Display a listing of patients.
     */
    public function index(Request $request)
    {
        $query = Patient::query();
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('no_rm', 'like', '%' . $request->search . '%');
        }
        
        // Paginate for the CRUD view, or return limit for fast searches
        if ($request->boolean('paginate')) {
            return response()->json($query->latest()->paginate(10));
        }

        return response()->json($query->limit(20)->get());
    }

    /**
     * Store a newly created patient.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'no_rm' => 'required|string|unique:patients',
            'name' => 'required|string|max:255',
            'age' => 'nullable|integer|min:0',
            'gender' => 'nullable|in:L,P',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $patient = Patient::create($validator->validated());

        return response()->json($patient, 201);
    }

    /**
     * Display the specified patient.
     */
    public function show($id)
    {
        $patient = Patient::with(['nutritionalVisits' => function($query) {
            $query->orderBy('visit_date', 'desc');
        }, 'meals.items.food' => function($query) {
            $query->orderBy('date', 'desc');
        }])->findOrFail($id);
        
        return response()->json($patient);
    }

    /**
     * Update the specified patient.
     */
    public function update(Request $request, $id)
    {
        $patient = Patient::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'no_rm' => 'required|string|unique:patients,no_rm,' . $id,
            'name' => 'required|string|max:255',
            'age' => 'nullable|integer|min:0',
            'gender' => 'nullable|in:L,P',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $patient->update($validator->validated());

        return response()->json($patient);
    }

    /**
     * Remove the specified patient.
     */
    public function destroy($id)
    {
        $patient = Patient::findOrFail($id);
        $patient->delete();

        return response()->json(['message' => 'Patient deleted successfully']);
    }
}
