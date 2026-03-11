<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LeaveRequest;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LeaveRequestController extends Controller
{
    /**
     * Display a listing of leave requests
     */
    public function index(Request $request)
    {
        $query = LeaveRequest::with(['employee', 'creator', 'approver']);

        // Filter by employee
        if ($request->has('employee_id')) {
            $query->byEmployee($request->employee_id);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->byStatus($request->status);
        }

        // Filter by month/year
        if ($request->has('month') && $request->has('year')) {
            $query->byMonth($request->year, $request->month);
        }

        // Filter by date range
        if ($request->has('start_date')) {
            $query->where('start_date', '>=', $request->start_date);
        }
        if ($request->has('end_date')) {
            $query->where('end_date', '<=', $request->end_date);
        }

        $leaveRequests = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $leaveRequests,
        ]);
    }

    /**
     * Store a newly created leave request
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'leave_type' => 'required|in:annual,sick,personal,other',
            'reason' => 'nullable|string',
        ]);

        // Check for overlapping leave requests
        $leaveRequest = new LeaveRequest();
        if ($leaveRequest->hasOverlap(
            $validated['employee_id'],
            $validated['start_date'],
            $validated['end_date']
        )) {
            return response()->json([
                'success' => false,
                'message' => 'Karyawan sudah memiliki permintaan cuti yang overlap dengan tanggal ini',
            ], 422);
        }

        $validated['created_by'] = auth()->id();
        $validated['status'] = 'pending';

        $leaveRequest = LeaveRequest::create($validated);
        $leaveRequest->load(['employee', 'creator']);

        return response()->json([
            'success' => true,
            'message' => 'Permintaan cuti berhasil dibuat',
            'data' => $leaveRequest,
        ], 201);
    }

    /**
     * Display the specified leave request
     */
    public function show(string $id)
    {
        $leaveRequest = LeaveRequest::with(['employee', 'creator', 'approver'])->find($id);

        if (!$leaveRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Permintaan cuti tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $leaveRequest,
        ]);
    }

    /**
     * Update the specified leave request
     */
    public function update(Request $request, string $id)
    {
        $leaveRequest = LeaveRequest::find($id);

        if (!$leaveRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Permintaan cuti tidak ditemukan',
            ], 404);
        }

        // Only pending requests can be updated
        if ($leaveRequest->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Hanya permintaan cuti dengan status pending yang dapat diubah',
            ], 422);
        }

        $validated = $request->validate([
            'employee_id' => 'sometimes|required|exists:employees,id',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date|after_or_equal:start_date',
            'leave_type' => 'sometimes|required|in:annual,sick,personal,other',
            'reason' => 'nullable|string',
        ]);

        // Check for overlapping leave requests (excluding current)
        if (isset($validated['employee_id']) || isset($validated['start_date']) || isset($validated['end_date'])) {
            $employeeId = $validated['employee_id'] ?? $leaveRequest->employee_id;
            $startDate = $validated['start_date'] ?? $leaveRequest->start_date;
            $endDate = $validated['end_date'] ?? $leaveRequest->end_date;

            if ($leaveRequest->hasOverlap($employeeId, $startDate, $endDate, $leaveRequest->id)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Karyawan sudah memiliki permintaan cuti yang overlap dengan tanggal ini',
                ], 422);
            }
        }

        $leaveRequest->update($validated);
        $leaveRequest->load(['employee', 'creator']);

        return response()->json([
            'success' => true,
            'message' => 'Permintaan cuti berhasil diperbarui',
            'data' => $leaveRequest,
        ]);
    }

    /**
     * Remove the specified leave request
     */
    public function destroy(string $id)
    {
        $leaveRequest = LeaveRequest::find($id);

        if (!$leaveRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Permintaan cuti tidak ditemukan',
            ], 404);
        }

        $leaveRequest->delete();

        return response()->json([
            'success' => true,
            'message' => 'Permintaan cuti berhasil dihapus',
        ]);
    }

    /**
     * Approve a leave request
     */
    public function approve(string $id)
    {
        $leaveRequest = LeaveRequest::find($id);

        if (!$leaveRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Permintaan cuti tidak ditemukan',
            ], 404);
        }

        if ($leaveRequest->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Hanya permintaan cuti dengan status pending yang dapat disetujui',
            ], 422);
        }

        $leaveRequest->approve(auth()->id());
        $leaveRequest->load(['employee', 'creator', 'approver']);

        return response()->json([
            'success' => true,
            'message' => 'Permintaan cuti berhasil disetujui',
            'data' => $leaveRequest,
        ]);
    }

    /**
     * Reject a leave request
     */
    public function reject(Request $request, string $id)
    {
        $validated = $request->validate([
            'rejection_reason' => 'nullable|string',
        ]);

        $leaveRequest = LeaveRequest::find($id);

        if (!$leaveRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Permintaan cuti tidak ditemukan',
            ], 404);
        }

        if ($leaveRequest->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Hanya permintaan cuti dengan status pending yang dapat ditolak',
            ], 422);
        }

        $leaveRequest->reject(auth()->id(), $validated['rejection_reason'] ?? null);
        $leaveRequest->load(['employee', 'creator', 'approver']);

        return response()->json([
            'success' => true,
            'message' => 'Permintaan cuti berhasil ditolak',
            'data' => $leaveRequest,
        ]);
    }
}
