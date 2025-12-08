<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Shift;
use Illuminate\Http\Request;

class ShiftController extends Controller
{
    /**
     * Display a listing of shifts
     */
    public function index()
    {
        $shifts = Shift::orderBy('start_time', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => $shifts,
        ]);
    }

    /**
     * Store a newly created shift
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:shifts,code',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
        ]);

        $shift = Shift::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Shift berhasil ditambahkan',
            'data' => $shift,
        ], 201);
    }

    /**
     * Display the specified shift
     */
    public function show(string $id)
    {
        $shift = Shift::find($id);

        if (!$shift) {
            return response()->json([
                'success' => false,
                'message' => 'Shift tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $shift,
        ]);
    }

    /**
     * Update the specified shift
     */
    public function update(Request $request, string $id)
    {
        $shift = Shift::find($id);

        if (!$shift) {
            return response()->json([
                'success' => false,
                'message' => 'Shift tidak ditemukan',
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:shifts,code,' . $id,
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
        ]);

        $shift->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Shift berhasil diperbarui',
            'data' => $shift,
        ]);
    }

    /**
     * Remove the specified shift
     */
    public function destroy(string $id)
    {
        $shift = Shift::find($id);

        if (!$shift) {
            return response()->json([
                'success' => false,
                'message' => 'Shift tidak ditemukan',
            ], 404);
        }

        $shift->delete();

        return response()->json([
            'success' => true,
            'message' => 'Shift berhasil dihapus',
        ]);
    }
}
