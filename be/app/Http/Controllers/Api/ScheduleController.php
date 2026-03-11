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
            'use_approved_leaves' => 'boolean', // Auto-load approved leaves
            'include_saturday' => 'boolean', // Include Saturday as working day
            'include_sunday' => 'boolean', // Include Sunday as working day
            'position_requirements' => 'nullable|array', // Minimum per position
            'position_requirements.*.position' => 'required|string',
            'position_requirements.*.min_count' => 'required|integer|min:1',
            'shift_limits' => 'nullable|array', // Maximum per shift
            'shift_limits.*.shift_id' => 'required|exists:shifts,id',
            'shift_limits.*.max_count' => 'required|integer|min:1',
            'use_5_1_pattern' => 'boolean', // Enable 5 days on, 1 day off pattern
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

            // Helper function to get available shifts for an employee
            $getAvailableShifts = function($employee) use ($shifts) {
                if (!empty($employee->preferred_shifts) && is_array($employee->preferred_shifts)) {
                    // Filter shifts based on employee preference
                    $preferredShifts = $shifts->whereIn('id', $employee->preferred_shifts);
                    return $preferredShifts->isNotEmpty() ? $preferredShifts : $shifts;
                }
                return $shifts;
            };

            // Generate dates for the month
            $startDate = Carbon::create($validated['year'], $validated['month'], 1);
            $endDate = $startDate->copy()->endOfMonth();
            $dates = [];

            \Log::info("Generating dates from {$startDate->toDateString()} to {$endDate->toDateString()}");

            for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
                $dates[] = $date->copy();
            }

            \Log::info("Total dates generated: " . count($dates));
            if (count($dates) > 0) {
                \Log::info("First date: " . $dates[0]->toDateString());
                \Log::info("Last date: " . $dates[count($dates)-1]->toDateString());
            }

            // Auto-load approved leaves if enabled (default: true)
            $employeeLeavesArray = $validated['employee_leaves'] ?? [];
            
            if ($validated['use_approved_leaves'] ?? true) {
                $approvedLeaves = \App\Models\LeaveRequest::where('status', 'approved')
                    ->where(function($q) use ($startDate, $endDate) {
                        $q->whereBetween('start_date', [$startDate, $endDate])
                          ->orWhereBetween('end_date', [$startDate, $endDate])
                          ->orWhere(function($q2) use ($startDate, $endDate) {
                              $q2->where('start_date', '<=', $startDate)
                                 ->where('end_date', '>=', $endDate);
                          });
                    })
                    ->with('employee')
                    ->get();

                // Convert approved leaves to employee_leaves format
                foreach ($approvedLeaves as $leave) {
                    $employeeLeavesArray[] = [
                        'employee_id' => $leave->employee_id,
                        'dates' => $leave->getDateRange()
                    ];
                }
            }

            // Prepare employee leaves map
            $employeeLeaves = [];
            if (!empty($employeeLeavesArray)) {
                foreach ($employeeLeavesArray as $leave) {
                    if (!isset($employeeLeaves[$leave['employee_id']])) {
                        $employeeLeaves[$leave['employee_id']] = [];
                    }
                    $employeeLeaves[$leave['employee_id']] = array_merge(
                        $employeeLeaves[$leave['employee_id']],
                        $leave['dates']
                    );
                }
                
                // Remove duplicates
                foreach ($employeeLeaves as $empId => $leaveDates) {
                    $employeeLeaves[$empId] = array_unique($leaveDates);
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
                // Ensure $date is a Carbon instance
                $dateString = $date instanceof \Carbon\Carbon ? $date->toDateString() : $date;
                $dayOfWeek = $date instanceof \Carbon\Carbon ? $date->dayOfWeek : \Carbon\Carbon::parse($date)->dayOfWeek;

                \Log::info("Processing date: {$dateString}, dayOfWeek: {$dayOfWeek}");
                \Log::info("  Params: includeSaturday=" . ($validated['include_saturday'] ?? 'true') . ", includeSunday=" . ($validated['include_sunday'] ?? 'false'));

                // Prepare shift limits and counts for this date
                $shiftCounts = []; // Reset for each date
                $shiftLimits = [];
                if (isset($validated['shift_limits'])) {
                    foreach ($validated['shift_limits'] as $limit) {
                        $shiftLimits[$limit['shift_id']] = $limit['max_count'];
                        $shiftCounts[$limit['shift_id']] = 0;
                    }
                }

                // Check if Saturday/Sunday should be off
                $isSaturday = $dayOfWeek === 6;
                $isSunday = $dayOfWeek === 0;
                $includeSaturday = $validated['include_saturday'] ?? true;
                $includeSunday = $validated['include_sunday'] ?? false;

                // Mark Saturday as off if not included
                if ($isSaturday && !$includeSaturday) {
                    \Log::info("  -> Saturday OFF for {$dateString}");
                    foreach ($employees as $employee) {
                        $schedules[] = [
                            'employee_id' => $employee->id,
                            'shift_id' => null,
                            'schedule_date' => $dateString,
                            'status' => 'off',
                            'notes' => 'Weekend (Saturday)',
                            'created_by' => auth()->id(),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
                    continue;
                }

                // Mark Sunday as off if not included
                if ($isSunday && !$includeSunday) {
                    \Log::info("  -> Sunday OFF for {$dateString}");
                    foreach ($employees as $employee) {
                        $schedules[] = [
                            'employee_id' => $employee->id,
                            'shift_id' => null,
                            'schedule_date' => $dateString,
                            'status' => 'off',
                            'notes' => 'Weekend (Sunday)',
                            'created_by' => auth()->id(),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
                    continue;
                }

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

                // Check if 5-1 pattern is enabled
                if ($validated['use_5_1_pattern'] ?? false) {
                    \Log::info("  -> Using 5-1 pattern for {$dateString}");
                    
                    // Calculate day index from start of month (0-based)
                    $dayIndex = $date->day - 1;
                    
                    // On first day of month, check previous month to continue the cycle
                    static $employeeCycleOffsets = null;
                    if ($dayIndex === 0 && $employeeCycleOffsets === null) {
                        \Log::info("  -> First day of month, checking previous month schedules...");
                        
                        // Get previous month
                        $prevMonth = $startDate->copy()->subMonth();
                        $prevMonthYear = $prevMonth->year;
                        $prevMonthMonth = $prevMonth->month;
                        
                        // Query last 6 days of previous month for each employee
                        $prevMonthEnd = $prevMonth->copy()->endOfMonth();
                        $prevMonthStart = $prevMonthEnd->copy()->subDays(5); // Last 6 days
                        
                        $prevSchedules = Schedule::whereBetween('schedule_date', [
                            $prevMonthStart->toDateString(),
                            $prevMonthEnd->toDateString()
                        ])->whereIn('employee_id', $employees->pluck('id'))
                          ->orderBy('schedule_date')
                          ->get();
                        
                        \Log::info("  -> Found " . $prevSchedules->count() . " schedules from previous month");
                        
                        // Calculate cycle position for each employee
                        $employeeCycleOffsets = [];
                        foreach ($employees as $index => $employee) {
                            // Get employee's schedules from last 6 days
                            $empPrevSchedules = $prevSchedules->where('employee_id', $employee->id)
                                ->sortBy('schedule_date')
                                ->values();
                            
                            if ($empPrevSchedules->isEmpty()) {
                                // No previous data, use default offset based on index
                                $employeeCycleOffsets[$employee->id] = $index % 6;
                                \Log::info("    {$employee->name}: No prev data, using default offset {$employeeCycleOffsets[$employee->id]}");
                            } else {
                                // Count consecutive work days from the end
                                $consecutiveWorkDays = 0;
                                $consecutiveOffDays = 0;
                                
                                // Check from most recent backwards
                                for ($i = $empPrevSchedules->count() - 1; $i >= 0; $i--) {
                                    $sched = $empPrevSchedules[$i];
                                    if ($sched->status === 'scheduled') {
                                        if ($consecutiveOffDays > 0) break; // Stop if we hit work after off
                                        $consecutiveWorkDays++;
                                    } else if (in_array($sched->status, ['off', 'holiday'])) {
                                        if ($consecutiveWorkDays > 0) break; // Stop if we hit off after work
                                        $consecutiveOffDays++;
                                    }
                                }
                                
                                // Determine where we are in the 5-1 cycle
                                // If last day was off, we start fresh with work (position 0)
                                // If we had N consecutive work days, continue from position N
                                if ($consecutiveOffDays > 0) {
                                    $cyclePosition = 0; // Start fresh after off day
                                } else {
                                    $cyclePosition = $consecutiveWorkDays % 6;
                                }
                                
                                // Calculate offset needed to achieve this position on day 0
                                // cycleDay = (dayIndex + offset) % 6
                                // We want cycleDay = cyclePosition when dayIndex = 0
                                // So: cyclePosition = (0 + offset) % 6
                                // Therefore: offset = cyclePosition
                                $employeeCycleOffsets[$employee->id] = $cyclePosition;
                                
                                \Log::info("    {$employee->name}: Last {$consecutiveWorkDays} work days, {$consecutiveOffDays} off days -> cycle position {$cyclePosition}, offset {$employeeCycleOffsets[$employee->id]}");
                            }
                        }
                    } else if ($employeeCycleOffsets === null) {
                        // Not first day but offsets not set (shouldn't happen, but fallback)
                        $employeeCycleOffsets = [];
                        foreach ($employees as $index => $employee) {
                            $employeeCycleOffsets[$employee->id] = $index % 6;
                        }
                    }
                    
                    foreach ($employees as $index => $employee) {
                        // Use calculated offset from previous month, or default to index
                        $employeeOffset = $employeeCycleOffsets[$employee->id] ?? ($index % 6);
                        $cycleDay = ($dayIndex + $employeeOffset) % 6;
                        
                        // Day 5 in cycle = off day (0-4 = work, 5 = off)
                        $isOffDay = ($cycleDay === 5);
                        
                        \Log::info("    Employee: {$employee->name} (Index: {$index}, Offset: {$employeeOffset}, CycleDay: {$cycleDay}, IsOff: " . ($isOffDay ? 'YES' : 'NO') . ")");
                        
                        // Priority 1: Check if employee has leave (highest priority)
                        $hasLeave = isset($employeeLeaves[$employee->id]) && in_array($dateString, $employeeLeaves[$employee->id]);
                        
                        if ($hasLeave) {
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
                            \Log::info("      -> LEAVE");
                            continue;
                        }
                        
                        // Priority 2: Apply 5-1 pattern (off day)
                        if ($isOffDay) {
                            $schedules[] = [
                                'employee_id' => $employee->id,
                                'shift_id' => null,
                                'schedule_date' => $dateString,
                                'status' => 'off',
                                'notes' => '5-1 pattern off day',
                                'created_by' => auth()->id(),
                                'created_at' => now(),
                                'updated_at' => now(),
                            ];
                            \Log::info("      -> OFF (5-1 pattern)");
                            continue;
                        }
                        
                        // Priority 3: Work day - assign shift
                        // Get available shifts for this employee
                        $employeeShifts = $getAvailableShifts($employee);
                        
                        // Select shift (rotate through shifts for balanced distribution)
                        if ($validated['random_assignment']) {
                            $shiftsArray = $employeeShifts->values()->all();
                            $shift = $shiftsArray[array_rand($shiftsArray)];
                        } else {
                            // Use employee index + day index for better rotation
                            $shiftIndex = ($index + $dayIndex) % $employeeShifts->count();
                            $shift = $employeeShifts->values()->all()[$shiftIndex];
                        }
                        
                        \Log::info("      Selected shift: {$shift->code} (ID: {$shift->id})");
                        
                        // Priority 4: Check shift limits (but don't block, just try alternatives)
                        if (isset($shiftLimits[$shift->id])) {
                            $currentCount = $shiftCounts[$shift->id] ?? 0;
                            if ($currentCount >= $shiftLimits[$shift->id]) {
                                \Log::info("      Shift {$shift->code} is full ({$currentCount}/{$shiftLimits[$shift->id]}), looking for alternative...");
                                
                                // Try to find an alternative shift that's not full
                                $alternativeShift = null;
                                foreach ($employeeShifts as $s) {
                                    $sCount = $shiftCounts[$s->id] ?? 0;
                                    $sLimit = $shiftLimits[$s->id] ?? PHP_INT_MAX;
                                    if ($sCount < $sLimit) {
                                        $alternativeShift = $s;
                                        \Log::info("      Found alternative: {$s->code} ({$sCount}/{$sLimit})");
                                        break;
                                    }
                                }
                                
                                if ($alternativeShift) {
                                    $shift = $alternativeShift;
                                } else {
                                    // If all preferred shifts are full, use ANY available shift
                                    foreach ($shifts as $s) {
                                        $sCount = $shiftCounts[$s->id] ?? 0;
                                        $sLimit = $shiftLimits[$s->id] ?? PHP_INT_MAX;
                                        if ($sCount < $sLimit) {
                                            $shift = $s;
                                            \Log::info("      Using any available shift: {$s->code}");
                                            break;
                                        }
                                    }
                                }
                                // Note: We removed the "mark as off" logic here
                                // In 5-1 pattern, employees MUST work on work days
                            }
                        }
                        
                        // Create schedule entry
                        $schedules[] = [
                            'employee_id' => $employee->id,
                            'shift_id' => $shift->id,
                            'schedule_date' => $dateString,
                            'status' => 'scheduled',
                            'notes' => '5-1 pattern work day',
                            'created_by' => auth()->id(),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                        
                        // Update shift count for tracking
                        $shiftCounts[$shift->id] = ($shiftCounts[$shift->id] ?? 0) + 1;
                        
                        \Log::info("      -> SCHEDULED: {$shift->code}");
                    }
                    
                    \Log::info("  -> Completed {$dateString} with 5-1 pattern: " . count($employees) . " schedules");
                    continue; // Skip normal scheduling logic
                }

                // Normal scheduling logic (when 5-1 pattern is not enabled)
                // Determine how many employees to schedule for this day
                $numEmployees = $validated['random_assignment'] 
                    ? rand($validated['min_employees_per_day'], $validated['max_employees_per_day'])
                    : $validated['max_employees_per_day'];

                $scheduledToday = 0;
                $positionCounts = []; // Track scheduled count per position
                $shiftCounts = []; // Track scheduled count per shift
                
                // Prepare position requirements map
                $positionRequirements = [];
                if (isset($validated['position_requirements'])) {
                    foreach ($validated['position_requirements'] as $req) {
                        $positionRequirements[$req['position']] = $req['min_count'];
                        $positionCounts[$req['position']] = 0;
                    }
                }

                // First pass: Schedule employees to meet position requirements
                $scheduledEmployeeIds = [];
                
                if (!empty($positionRequirements)) {
                    \Log::info("  === FIRST PASS: Position Requirements ===");
                    \Log::info("  Position requirements: " . json_encode($positionRequirements));
                }
                
                foreach ($positionRequirements as $position => $minCount) {
                    \Log::info("  Processing position: {$position}, min required: {$minCount}");
                    
                    $employeesInPosition = $employees->filter(function($emp) use ($position) {
                        return strcasecmp($emp->position, $position) === 0;
                    });
                    
                    \Log::info("  Found {$employeesInPosition->count()} employees with position {$position}");
                    
                    // Truly random shuffle
                    $empArray = $employeesInPosition->values()->all();
                    shuffle($empArray);
                    $employeesInPosition = collect($empArray);

                    $countForPosition = 0;
                    foreach ($employeesInPosition as $employee) {
                        \Log::info("    Trying employee: {$employee->name} (ID: {$employee->id})");
                        
                        if ($countForPosition >= $minCount) {
                            \Log::info("    -> SKIP: Position requirement already met ({$countForPosition}/{$minCount})");
                            break;
                        }
                        
                        if (in_array($employee->id, $scheduledEmployeeIds)) {
                            \Log::info("    -> SKIP: Already scheduled in first pass");
                            continue;
                        }
                        
                        if ($scheduledToday >= $numEmployees) {
                            \Log::info("    -> SKIP: Daily limit reached ({$scheduledToday}/{$numEmployees})");
                            break;
                        }

                        // Check if employee has leave
                        if (isset($employeeLeaves[$employee->id]) && in_array($dateString, $employeeLeaves[$employee->id])) {
                            \Log::info("    -> SKIP: Employee has leave on this date");
                            continue;
                        }

                        // Assign shift
                        $employeeShifts = $getAvailableShifts($employee);
                        
                        \Log::info("    Available shifts for employee: " . $employeeShifts->pluck('code')->implode(', '));
                        
                        if ($validated['random_assignment']) {
                            $shiftsArray = $employeeShifts->values()->all();
                            $shift = $shiftsArray[array_rand($shiftsArray)];
                        } else {
                            $shift = $employeeShifts->values()->all()[$employeeIndex % $employeeShifts->count()];  
                        }
                        
                        \Log::info("    Selected shift: {$shift->code}");

                        // Check shift limits (same as second pass)
                        if (isset($shiftLimits[$shift->id])) {
                            $currentCount = $shiftCounts[$shift->id] ?? 0;
                            if ($currentCount >= $shiftLimits[$shift->id]) {
                                // This shift is full, try to find another shift
                                $alternativeShift = null;
                                foreach ($shifts as $s) {
                                    $sCount = $shiftCounts[$s->id] ?? 0;
                                    $sLimit = $shiftLimits[$s->id] ?? PHP_INT_MAX;
                                    if ($sCount < $sLimit) {
                                        $alternativeShift = $s;
                                        break;
                                    }
                                }
                                
                                if ($alternativeShift) {
                                    $shift = $alternativeShift;
                                } else {
                                    // All shifts are full, skip this employee
                                    continue;
                                }
                            }
                        }

                        $shiftHours = $this->calculateShiftHours($shift);

                        // Check constraints (simplified for position requirements)
                        $canSchedule = true;

                        if (isset($validated['max_hours_per_day']) && $shiftHours > $validated['max_hours_per_day']) {
                            $canSchedule = false;
                        }

                        if (isset($validated['max_hours_per_week'])) {
                            $weekNumber = \Carbon\Carbon::parse($dateString)->weekOfYear;
                            $weeklyHours = $employeeHours[$employee->id]['weekly'][$weekNumber] ?? 0;
                            if ($weeklyHours + $shiftHours > $validated['max_hours_per_week']) {
                                $canSchedule = false;
                                \Log::info("    -> Constraint FAILED: Max hours per week ({$weeklyHours} + {$shiftHours} > {$validated['max_hours_per_week']})");
                            }
                        }

                        if (isset($validated['max_hours_per_month'])) {
                            if ($employeeHours[$employee->id]['monthly'] + $shiftHours > $validated['max_hours_per_month']) {
                                $canSchedule = false;
                                \Log::info("    -> Constraint FAILED: Max hours per month ({$employeeHours[$employee->id]['monthly']} + {$shiftHours} > {$validated['max_hours_per_month']})");
                            }
                        }

                        // Check if shift can be scheduled (basic check)
                        if ($canSchedule) {
                            // Create schedule entry
                            $schedules[] = [
                                'employee_id' => $employee->id,
                                'shift_id' => $shift->id,
                                'schedule_date' => $dateString,
                                'status' => 'scheduled',
                                'notes' => "Position requirement: {$position}",
                                'created_by' => auth()->id(),
                                'created_at' => now(),
                                'updated_at' => now(),
                            ];

                            // Update tracking
                            $scheduledEmployeeIds[] = $employee->id;
                            $positionCounts[$position] = ($positionCounts[$position] ?? 0) + 1;
                            $countForPosition++;
                            $scheduledToday++;

                            // Update hours tracking
                            $weekNumber = \Carbon\Carbon::parse($dateString)->weekOfYear;
                            $employeeHours[$employee->id]['daily'][$dateString] = $shiftHours;
                            $employeeHours[$employee->id]['weekly'][$weekNumber] = 
                                ($employeeHours[$employee->id]['weekly'][$weekNumber] ?? 0) + $shiftHours;
                            $employeeHours[$employee->id]['monthly'] += $shiftHours;

                            // Update shift count
                            if (isset($shiftLimits[$shift->id])) {
                                $shiftCounts[$shift->id] = ($shiftCounts[$shift->id] ?? 0) + 1;
                            }

                            $employeeIndex++;
                            
                            \Log::info("    -> SUCCESS: Scheduled {$employee->name} for shift {$shift->code}");
                            \Log::info("    Position count now: {$countForPosition}/{$minCount}");
                        } else {
                            \Log::info("    -> FAILED: Could not schedule {$employee->name} due to constraints.");
                        }
                    }
                    
                    \Log::info("  Completed position {$position}: scheduled {$countForPosition}/{$minCount} employees");
                }

                // Second pass: Fill remaining slots with any available employees
                // Truly random shuffle
                $empArray = $employees->values()->all();
                shuffle($empArray);
                $availableEmployees = collect($empArray);

                foreach ($availableEmployees as $employee) {
                    // Skip if already scheduled in first pass
                    if (in_array($employee->id, $scheduledEmployeeIds)) {
                        continue;
                    }

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
                    $employeeShifts = $getAvailableShifts($employee);
                    
                    if ($validated['random_assignment']) {
                        $shiftsArray = $employeeShifts->values()->all();
                        $shift = $shiftsArray[array_rand($shiftsArray)];
                    } else {
                        $shift = $employeeShifts->values()->all()[$employeeIndex % $employeeShifts->count()];
                    }

                    // Check shift limits
                    if (isset($shiftLimits[$shift->id])) {
                        $currentCount = $shiftCounts[$shift->id] ?? 0;
                        if ($currentCount >= $shiftLimits[$shift->id]) {
                            // This shift is full, try to find another shift
                            $alternativeShift = null;
                            foreach ($shifts as $s) {
                                $sCount = $shiftCounts[$s->id] ?? 0;
                                $sLimit = $shiftLimits[$s->id] ?? PHP_INT_MAX;
                                if ($sCount < $sLimit) {
                                    $alternativeShift = $s;
                                    break;
                                }
                            }
                            
                            if ($alternativeShift) {
                                $shift = $alternativeShift;
                            } else {
                                // All shifts are full, mark as off
                                $schedules[] = [
                                    'employee_id' => $employee->id,
                                    'shift_id' => null,
                                    'schedule_date' => $dateString,
                                    'status' => 'off',
                                    'notes' => 'All shifts full',
                                    'created_by' => auth()->id(),
                                    'created_at' => now(),
                                    'updated_at' => now(),
                                ];
                                continue;
                            }
                        }
                    }

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
                        $weekNumber = \Carbon\Carbon::parse($dateString)->weekOfYear;
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
                        $weekNumber = \Carbon\Carbon::parse($dateString)->weekOfYear;
                        $employeeHours[$employee->id]['daily'][$dateString] = $shiftHours;
                        $employeeHours[$employee->id]['weekly'][$weekNumber] = 
                            ($employeeHours[$employee->id]['weekly'][$weekNumber] ?? 0) + $shiftHours;
                        $employeeHours[$employee->id]['monthly'] += $shiftHours;

                        // Update shift count
                        if (isset($shiftLimits[$shift->id])) {
                            $shiftCounts[$shift->id] = ($shiftCounts[$shift->id] ?? 0) + 1;
                        }

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

                // Final check: Ensure ALL employees have an entry for this date
                // This prevents dates from being completely missing in the database
                $scheduledEmployeeIdsForDate = [];
                foreach ($schedules as $schedule) {
                    if ($schedule['schedule_date'] === $dateString) {
                        $scheduledEmployeeIdsForDate[] = $schedule['employee_id'];
                    }
                }

                foreach ($employees as $employee) {
                    if (!in_array($employee->id, $scheduledEmployeeIdsForDate)) {
                        // Employee not scheduled yet for this date, mark as off
                        $schedules[] = [
                            'employee_id' => $employee->id,
                            'shift_id' => null,
                            'schedule_date' => $dateString,
                            'status' => 'off',
                            'notes' => 'Not scheduled',
                            'created_by' => auth()->id(),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
                }

                // Log completion for this date
                $countForDate = 0;
                foreach ($schedules as $s) {
                    if ($s['schedule_date'] === $dateString) {
                        $countForDate++;
                    }
                }
                \Log::info("  -> Completed {$dateString}: {$countForDate} schedules created");
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
