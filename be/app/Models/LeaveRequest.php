<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class LeaveRequest extends Model
{
    protected $fillable = [
        'employee_id',
        'start_date',
        'end_date',
        'leave_type',
        'reason',
        'status',
        'rejection_reason',
        'approved_by',
        'approved_at',
        'created_by',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'approved_at' => 'datetime',
    ];

    protected $appends = [
        'duration_days',
        'date_range',
    ];

    /**
     * Get the employee that owns the leave request
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Get the user who created this leave request
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who approved/rejected this leave request
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Scope a query to only include leave requests with a specific status
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope a query to only include leave requests for a specific employee
     */
    public function scopeByEmployee($query, $employeeId)
    {
        return $query->where('employee_id', $employeeId);
    }

    /**
     * Scope a query to only include leave requests for a specific month
     */
    public function scopeByMonth($query, $year, $month)
    {
        $startDate = Carbon::create($year, $month, 1)->startOfMonth();
        $endDate = Carbon::create($year, $month, 1)->endOfMonth();

        return $query->where(function($q) use ($startDate, $endDate) {
            $q->whereBetween('start_date', [$startDate, $endDate])
              ->orWhereBetween('end_date', [$startDate, $endDate])
              ->orWhere(function($q2) use ($startDate, $endDate) {
                  $q2->where('start_date', '<=', $startDate)
                     ->where('end_date', '>=', $endDate);
              });
        });
    }

    /**
     * Get duration in days (accessor)
     */
    public function getDurationDaysAttribute(): int
    {
        return $this->start_date->diffInDays($this->end_date) + 1;
    }

    /**
     * Get array of dates in the leave period (accessor)
     */
    public function getDateRangeAttribute(): array
    {
        $dates = [];
        $current = $this->start_date->copy();
        
        while ($current->lte($this->end_date)) {
            $dates[] = $current->format('Y-m-d');
            $current->addDay();
        }
        
        return $dates;
    }

    /**
     * Get array of dates in the leave period (method for backend use)
     */
    public function getDateRange(): array
    {
        return $this->date_range;
    }

    /**
     * Approve this leave request
     */
    public function approve($userId): bool
    {
        if ($this->status !== 'pending') {
            return false;
        }

        $this->status = 'approved';
        $this->approved_by = $userId;
        $this->approved_at = now();
        $this->rejection_reason = null;
        
        return $this->save();
    }

    /**
     * Reject this leave request
     */
    public function reject($userId, $reason = null): bool
    {
        if ($this->status !== 'pending') {
            return false;
        }

        $this->status = 'rejected';
        $this->approved_by = $userId;
        $this->approved_at = now();
        $this->rejection_reason = $reason;
        
        return $this->save();
    }

    /**
     * Check if this leave request overlaps with another
     */
    public function hasOverlap($employeeId, $startDate, $endDate, $excludeId = null): bool
    {
        $query = static::where('employee_id', $employeeId)
            ->where('status', '!=', 'rejected')
            ->where(function($q) use ($startDate, $endDate) {
                $q->whereBetween('start_date', [$startDate, $endDate])
                  ->orWhereBetween('end_date', [$startDate, $endDate])
                  ->orWhere(function($q2) use ($startDate, $endDate) {
                      $q2->where('start_date', '<=', $startDate)
                         ->where('end_date', '>=', $endDate);
                  });
            });

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }
}
