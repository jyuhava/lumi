<?php

namespace App\Http\Controllers\Personal;

use App\Http\Controllers\Controller;
use App\Models\PersonalActivityLog;
use Illuminate\Http\Request;

/**
 * ActivityLogController – sync & retrieve activity logs for personal users.
 *
 * POST /api/personal/activity-logs/sync  (bulk upsert from device)
 * GET  /api/personal/activity-logs       (fetch all cloud logs)
 */
class ActivityLogController extends Controller
{
    /**
     * Bulk-sync activity logs from device → cloud.
     */
    public function sync(Request $request)
    {
        $request->validate([
            'logs'                  => 'required|array|min:1',
            'logs.*.local_id'       => 'required|string',
            'logs.*.entry_type'     => 'required|in:manual,tracking',
            'logs.*.activity_type'  => 'required|string|max:30',
            'logs.*.name'           => 'required|string|max:100',
            'logs.*.steps'          => 'required|integer|min:0',
            'logs.*.duration'       => 'required|integer|min:0',
            'logs.*.distance'       => 'required|numeric|min:0',
            'logs.*.calories'       => 'required|numeric|min:0',
            'logs.*.recorded_at'    => 'required|date',
        ]);

        $userId = $request->user()->id;
        $synced = 0;

        foreach ($request->logs as $entry) {
            $created = PersonalActivityLog::firstOrCreate(
                [
                    'personal_user_id' => $userId,
                    'local_id'         => $entry['local_id'],
                ],
                [
                    'entry_type'    => $entry['entry_type'],
                    'activity_type' => $entry['activity_type'],
                    'name'          => $entry['name'],
                    'steps'         => $entry['steps'],
                    'duration'      => $entry['duration'],
                    'distance'      => $entry['distance'],
                    'calories'      => $entry['calories'],
                    'recorded_at'   => $entry['recorded_at'],
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
     * Return all cloud activity logs for the authenticated personal user.
     */
    public function index(Request $request)
    {
        $logs = PersonalActivityLog::where('personal_user_id', $request->user()->id)
            ->orderByDesc('recorded_at')
            ->get();

        return response()->json([
            'success' => true,
            'logs'    => $logs,
        ]);
    }
}
