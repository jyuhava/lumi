<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Schedule extends Model
{
    protected $fillable = [
        'employee_id',
        'shift_id',
        'schedule_date',
        'status',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'schedule_date' => 'date',
        'status' => 'string',
    ];

    /**
     * Get the employee that owns the schedule
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Get the shift assigned to this schedule
     */
    public function shift(): BelongsTo
    {
        return $this->belongsTo(Shift::class);
    }

    /**
     * Get the user who created this schedule
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Scope a query to only include schedules for a specific month
     */
    public function scopeByMonth($query, $year, $month)
    {
        return $query->whereYear('schedule_date', $year)
                     ->whereMonth('schedule_date', $month);
    }

    /**
     * Scope a query to only include schedules for a specific employee
     */
    public function scopeByEmployee($query, $employeeId)
    {
        return $query->where('employee_id', $employeeId);
    }

    /**
     * Scope a query to only include schedules for a specific shift
     */
    public function scopeByShift($query, $shiftId)
    {
        return $query->where('shift_id', $shiftId);
    }

    /**
     * Calculate work hours for this schedule
     */
    public function calculateWorkHours(): float
    {
        if (!$this->shift || in_array($this->status, ['leave', 'sick', 'holiday', 'off'])) {
            return 0;
        }

        $start = Carbon::parse($this->shift->start_time);
        $end = Carbon::parse($this->shift->end_time);

        // Handle overnight shifts
        if ($end->lt($start)) {
            $end->addDay();
        }

        return $start->diffInHours($end);
    }

    /**
     * Check if this schedule is overtime
     */
    public function isOvertime($maxHoursPerDay = 8): bool
    {
        return $this->calculateWorkHours() > $maxHoursPerDay;
    }
}
