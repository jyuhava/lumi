<?php

namespace App\Http\Controllers\Personal;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PersonalWaterLog;

class WaterLogController extends Controller
{
    public function sync(Request $request)
    {
        $request->validate([
            'logs'              => 'required|array',
            'logs.*.local_id'   => 'required|string',
            'logs.*.amount_ml'  => 'required|integer|min:1|max:5000',
            'logs.*.recorded_at'=> 'required|date',
        ]);

        $userId = $request->user()->id;
        $synced = 0;

        foreach ($request->logs as $entry) {
            $created = PersonalWaterLog::firstOrCreate(
                [
                    'personal_user_id' => $userId,
                    'local_id'         => $entry['local_id'],
                ],
                [
                    'amount_ml'   => $entry['amount_ml'],
                    'recorded_at' => $entry['recorded_at'],
                ]
            );
            if ($created->wasRecentlyCreated) $synced++;
        }

        return response()->json([
            'success' => true,
            'synced'  => $synced,
            'total'   => count($request->logs),
        ]);
    }

    public function index(Request $request)
    {
        $logs = PersonalWaterLog::where('personal_user_id', $request->user()->id)
            ->orderByDesc('recorded_at')
            ->get(['id', 'local_id', 'amount_ml', 'recorded_at']);

        return response()->json([
            'success' => true,
            'logs'    => $logs,
        ]);
    }
}
