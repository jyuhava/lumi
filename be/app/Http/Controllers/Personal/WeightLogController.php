<?php

namespace App\Http\Controllers\Personal;

use App\Http\Controllers\Controller;
use App\Models\PersonalWeightLog;
use Illuminate\Http\Request;

/**
 * WeightLogController – sync & retrieve weight logs for personal users.
 *
 * POST /api/personal/weight-logs/sync   (bulk upsert from device)
 * GET  /api/personal/weight-logs        (fetch all cloud logs)
 */
class WeightLogController extends Controller
{
    /**
     * Bulk-sync weight logs from device → cloud.
     * Each entry is identified by its `local_id`.
     * Duplicate local_ids are ignored (INSERT IGNORE / updateOrCreate).
     */
    public function sync(Request $request)
    {
        $request->validate([
            'logs'              => 'required|array|min:1',
            'logs.*.local_id'   => 'required|string',
            'logs.*.weight'     => 'required|numeric|min:10|max:500',
            'logs.*.recorded_at'=> 'required|date',
        ]);

        $userId = $request->user()->id;
        $synced = 0;

        foreach ($request->logs as $entry) {
            $created = PersonalWeightLog::firstOrCreate(
                [
                    'personal_user_id' => $userId,
                    'local_id'         => $entry['local_id'],
                ],
                [
                    'weight'      => $entry['weight'],
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

    /**
     * Return all cloud weight logs for the authenticated personal user.
     */
    public function index(Request $request)
    {
        $logs = PersonalWeightLog::where('personal_user_id', $request->user()->id)
            ->orderByDesc('recorded_at')
            ->get(['id', 'local_id', 'weight', 'recorded_at']);

        return response()->json([
            'success' => true,
            'logs'    => $logs,
        ]);
    }
}
