<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use App\Models\Employee;
use App\Models\Shift;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ScheduleController extends Controller
{
    /**
     * Display a listing of schedules with filters
     */
    public function index(Request $request)
    {
        $query = Schedule::with(['employee', 'shift', 'creator']);

        // Filter by month/year
        if ($request->has('month') && $request->has('year')) {
            $query->byMonth($request->year, $request->month);
        }

        // Filter by employee
        if ($request->has('employee_id')) {
            $query->byEmployee($request->employee_id);
        }

        // Filter by shift
        if ($request->has('shift_id')) {
            $query->byShift($request->shift_id);
        }

        // Filter by date range
        if ($request->has('start_date')) {
            $query->where('schedule_date', '>=', $request->start_date);
        }
        if ($request->has('end_date')) {
            $query->where('schedule_date', '<=', $request->end_date);
        }

        $schedules = $query->orderBy('schedule_date')
                           ->orderBy('employee_id')
                           ->get();

        return response()->json([
            'success' => true,
            'data' => $schedules,
        ]);
    }

    /**
     * Store a newly created schedule
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'shift_id' => 'nullable|exists:shifts,id',
            'schedule_date' => 'required|date',
            'status' => 'required|in:scheduled,leave,sick,holiday,off',
            'notes' => 'nullable|string',
        ]);

        $validated['created_by'] = auth()->id();

        $schedule = Schedule::create($validated);
        $schedule->load(['employee', 'shift']);

        return response()->json([
            'success' => true,
            'message' => 'Schedule created successfully',
            'data' => $schedule,
        ], 201);
    }

    /**
     * Display the specified schedule
     */
    public function show(string $id)
    {
        $schedule = Schedule::with(['employee', 'shift', 'creator'])->find($id);

        if (!$schedule) {
            return response()->json([
                'success' => false,
                'message' => 'Schedule not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $schedule,
        ]);
    }

    /**
     * Update the specified schedule
     */
    public function update(Request $request, string $id)
    {
        $schedule = Schedule::find($id);

        if (!$schedule) {
            return response()->json([
                'success' => false,
                'message' => 'Schedule not found',
            ], 404);
        }

        $validated = $request->validate([
            'employee_id' => 'sometimes|required|exists:employees,id',
            'shift_id' => 'nullable|exists:shifts,id',
            'schedule_date' => 'sometimes|required|date',
            'status' => 'sometimes|required|in:scheduled,leave,sick,holiday,off',
            'notes' => 'nullable|string',
        ]);

        $schedule->update($validated);
        $schedule->load(['employee', 'shift']);

        return response()->json([
            'success' => true,
            'message' => 'Schedule updated successfully',
            'data' => $schedule,
        ]);
    }

    /**
     * Remove the specified schedule
     */
    public function destroy(string $id)
    {
        $schedule = Schedule::find($id);

        if (!$schedule) {
            return response()->json([
                'success' => false,
                'message' => 'Schedule not found',
            ], 404);
        }

        $schedule->delete();

        return response()->json([
            'success' => true,
            'message' => 'Schedule deleted successfully',
        ]);
    }

    /**
     * Auto-generate monthly schedule with constraints
     */
    public function generate(Request $request)
    {
        $validated = $request->validate([
            'year' => 'required|integer|min:2024',
            'month' => 'required|integer|min:1|max:12',
            'min_employees_per_day' => 'required|integer|min:1',
            'max_employees_per_day' => 'required|integer|min:1',
            'max_hours_per_day' => 'nullable|integer|min:1|max:24',
            'max_hours_per_week' => 'nullable|integer|min:1',
            'max_hours_per_month' => 'nullable|integer|min:1',
            'random_assignment' => 'boolean',
            'exclude_dates' => 'nullable|array',
            'exclude_dates.*' => 'date',
            'employee_leaves' => 'nullable|array',
            'employee_leaves.*.employee_id' => 'required|exists:employees,id',
            'employee_leaves.*.dates' => 'required|array',
            'employee_leaves.*.dates.*' => 'date',
            'overwrite' => 'boolean', // Overwrite existing schedules
        ]);

        try {
            DB::beginTransaction();

            // Delete existing schedules if overwrite is true
            if ($validated['overwrite'] ?? false) {
                Schedule::byMonth($validated['year'], $validated['month'])->delete();
            }

            // Get active employees
            $employees = Employee::where('status', 'active')->get();

            if ($employees->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No active employees found',
                ], 400);
            }

            // Get all shifts
            $shifts = Shift::all();

            if ($shifts->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No shifts found',
                ], 400);
            }

            // Generate dates for the month
            $startDate = Carbon::create($validated['year'], $validated['month'], 1);
            $endDate = $startDate->copy()->endOfMonth();
            $dates = [];

            for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
                $dates[] = $date->copy();
            }

            // Prepare employee leaves map
            $employeeLeaves = [];
            if (isset($validated['employee_leaves'])) {
                foreach ($validated['employee_leaves'] as $leave) {
                    $employeeLeaves[$leave['employee_id']] = $leave['dates'];
                }
            }

            // Prepare exclude dates
            $excludeDates = $validated['exclude_dates'] ?? [];

            // Track employee work hours
            $employeeHours = [];
            foreach ($employees as $employee) {
                $employeeHours[$employee->id] = [
                    'daily' => [],
                    'weekly' => [],
                    'monthly' => 0,
                ];
            }

            $schedules = [];
            $employeeIndex = 0;

            // Generate schedules for each date
            foreach ($dates as $date) {
                $dateString = $date->toDateString();

                // Skip excluded dates (holidays)
                if (in_array($dateString, $excludeDates)) {
                    // Mark all employees as holiday
                    foreach ($employees as $employee) {
                        $schedules[] = [
                            'employee_id' => $employee->id,
                            'shift_id' => null,
                            'schedule_date' => $dateString,
                            'status' => 'holiday',
                            'notes' => 'Public holiday',
                            'created_by' => auth()->id(),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
                    continue;
                }

                // Determine how many employees to schedule for this day
                $numEmployees = $validated['random_assignment'] 
                    ? rand($validated['min_employees_per_day'], $validated['max_employees_per_day'])
                    : $validated['max_employees_per_day'];

                $scheduledToday = 0;
                $availableEmployees = $employees->shuffle();

                foreach ($availableEmployees as $employee) {
                    if ($scheduledToday >= $numEmployees) {
                        // Mark remaining employees as off
                        $schedules[] = [
                            'employee_id' => $employee->id,
                            'shift_id' => null,
                            'schedule_date' => $dateString,
                            'status' => 'off',
                            'notes' => null,
                            'created_by' => auth()->id(),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                        continue;
                    }

                    // Check if employee has leave on this date
                    if (isset($employeeLeaves[$employee->id]) && in_array($dateString, $employeeLeaves[$employee->id])) {
                        $schedules[] = [
                            'employee_id' => $employee->id,
                            'shift_id' => null,
                            'schedule_date' => $dateString,
                            'status' => 'leave',
                            'notes' => 'Scheduled leave',
                            'created_by' => auth()->id(),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                        continue;
                    }

                    // Assign shift (rotate or random)
                    $shift = $validated['random_assignment']
                        ? $shifts->random()
                        : $shifts[$employeeIndex % $shifts->count()];

                    // Calculate shift hours
                    $shiftHours = $this->calculateShiftHours($shift);

                    // Check constraints
                    $canSchedule = true;

                    // Check daily hours
                    if (isset($validated['max_hours_per_day']) && $shiftHours > $validated['max_hours_per_day']) {
                        $canSchedule = false;
                    }

                    // Check weekly hours
                    if (isset($validated['max_hours_per_week'])) {
                        $weekNumber = $date->weekOfYear;
                        $weeklyHours = $employeeHours[$employee->id]['weekly'][$weekNumber] ?? 0;
                        if ($weeklyHours + $shiftHours > $validated['max_hours_per_week']) {
                            $canSchedule = false;
                        }
                    }

                    // Check monthly hours
                    if (isset($validated['max_hours_per_month'])) {
                        if ($employeeHours[$employee->id]['monthly'] + $shiftHours > $validated['max_hours_per_month']) {
                            $canSchedule = false;
                        }
                    }

                    if ($canSchedule) {
                        $schedules[] = [
                            'employee_id' => $employee->id,
                            'shift_id' => $shift->id,
                            'schedule_date' => $dateString,
                            'status' => 'scheduled',
                            'notes' => null,
                            'created_by' => auth()->id(),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];

                        // Update hours tracking
                        $weekNumber = $date->weekOfYear;
                        $employeeHours[$employee->id]['daily'][$dateString] = $shiftHours;
                        $employeeHours[$employee->id]['weekly'][$weekNumber] = 
                            ($employeeHours[$employee->id]['weekly'][$weekNumber] ?? 0) + $shiftHours;
                        $employeeHours[$employee->id]['monthly'] += $shiftHours;

                        $scheduledToday++;
                        $employeeIndex++;
                    } else {
                        // Mark as off if constraints not met
                        $schedules[] = [
                            'employee_id' => $employee->id,
                            'shift_id' => null,
                            'schedule_date' => $dateString,
                            'status' => 'off',
                            'notes' => 'Constraint limit reached',
                            'created_by' => auth()->id(),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
                }
            }

            // Bulk insert schedules
            Schedule::insert($schedules);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Schedule generated successfully',
                'data' => [
                    'total_schedules' => count($schedules),
                    'month' => $validated['month'],
                    'year' => $validated['year'],
                ],
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate schedule: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get schedule summary/statistics
     */
    public function summary(Request $request)
    {
        $request->validate([
            'year' => 'required|integer',
            'month' => 'required|integer|min:1|max:12',
        ]);

        $schedules = Schedule::with(['employee', 'shift'])
            ->byMonth($request->year, $request->month)
            ->get();

        // Calculate statistics per employee
        $employeeStats = [];
        foreach ($schedules as $schedule) {
            $employeeId = $schedule->employee_id;
            
            if (!isset($employeeStats[$employeeId])) {
                $employeeStats[$employeeId] = [
                    'employee' => $schedule->employee,
                    'total_hours' => 0,
                    'scheduled_days' => 0,
                    'leave_days' => 0,
                    'sick_days' => 0,
                    'holiday_days' => 0,
                    'off_days' => 0,
                ];
            }

            $employeeStats[$employeeId]['total_hours'] += $schedule->calculateWorkHours();

            switch ($schedule->status) {
                case 'scheduled':
                    $employeeStats[$employeeId]['scheduled_days']++;
                    break;
                case 'leave':
                    $employeeStats[$employeeId]['leave_days']++;
                    break;
                case 'sick':
                    $employeeStats[$employeeId]['sick_days']++;
                    break;
                case 'holiday':
                    $employeeStats[$employeeId]['holiday_days']++;
                    break;
                case 'off':
                    $employeeStats[$employeeId]['off_days']++;
                    break;
            }
        }

        return response()->json([
            'success' => true,
            'data' => [
                'employee_statistics' => array_values($employeeStats),
                'total_schedules' => $schedules->count(),
            ],
        ]);
    }

    /**
     * Helper: Calculate shift hours
     */
    private function calculateShiftHours($shift): float
    {
        $start = Carbon::parse($shift->start_time);
        $end = Carbon::parse($shift->end_time);

        // Handle overnight shifts
        if ($end->lt($start)) {
            $end->addDay();
        }

        return $start->diffInHours($end);
    }
}
