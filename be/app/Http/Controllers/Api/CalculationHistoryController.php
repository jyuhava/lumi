<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CalculationHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CalculationHistoryController extends Controller
{
    public function index(Request $request)
    {
        $query = CalculationHistory::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc');

        // Filter by calculator type
        if ($request->has('calculator_type')) {
            $query->where('calculator_type', $request->calculator_type);
        }

        // Filter by method
        if ($request->has('method')) {
            $query->where('method', $request->method);
        }

        $history = $query->paginate(20);

        return response()->json($history);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'calculator_type' => 'required|string',
            'method' => 'required|string',
            'inputs' => 'required|array',
            'results' => 'required|array',
            'notes' => 'nullable|string',
        ]);

        $history = CalculationHistory::create([
            'user_id' => Auth::id(),
            'calculator_type' => $validated['calculator_type'],
            'method' => $validated['method'],
            'inputs' => $validated['inputs'],
            'results' => $validated['results'],
            'notes' => $validated['notes'] ?? null,
        ]);

        return response()->json([
            'message' => 'Riwayat perhitungan berhasil disimpan',
            'data' => $history
        ], 201);
    }

    public function show($id)
    {
        $history = CalculationHistory::where('user_id', Auth::id())
            ->findOrFail($id);

        return response()->json($history);
    }

    public function destroy($id)
    {
        $history = CalculationHistory::where('user_id', Auth::id())
            ->findOrFail($id);

        $history->delete();

        return response()->json([
            'message' => 'Riwayat perhitungan berhasil dihapus'
        ]);
    }

    public function destroyAll(Request $request)
    {
        $query = CalculationHistory::where('user_id', Auth::id());

        if ($request->has('calculator_type')) {
            $query->where('calculator_type', $request->calculator_type);
        }

        $query->delete();

        return response()->json([
            'message' => 'Semua riwayat perhitungan berhasil dihapus'
        ]);
    }
}

