<?php

namespace App\Http\Controllers;

use App\Models\Diet;
use Illuminate\Http\Request;

class DietController extends Controller
{
    public function index()
    {
        return response()->json(Diet::orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'abbreviation' => 'nullable|string|max:50',
            'description' => 'nullable|string'
        ]);

        $diet = Diet::create($validated);
        return response()->json($diet, 201);
    }

    public function show(Diet $diet)
    {
        return response()->json($diet);
    }

    public function update(Request $request, Diet $diet)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'abbreviation' => 'nullable|string|max:50',
            'description' => 'nullable|string'
        ]);

        $diet->update($validated);
        return response()->json($diet);
    }

    public function destroy(Diet $diet)
    {
        $diet->delete();
        return response()->json(['message' => 'Diet deleted successfully']);
    }
}
