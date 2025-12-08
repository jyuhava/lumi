<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\ShiftController;
use App\Http\Controllers\Api\StockTransactionController;
use App\Http\Controllers\Api\SupplierController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    
    // Settings
    Route::get('/settings/institution', [SettingController::class, 'getInstitution']);
    Route::put('/settings/institution', [SettingController::class, 'updateInstitution']);
    
    // User management
    Route::put('/user/profile', [UserController::class, 'updateProfile']);
    Route::put('/user/password', [UserController::class, 'changePassword']);
    
    // Resources
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('products', ProductController::class);
    Route::apiResource('suppliers', SupplierController::class);
    Route::apiResource('employees', EmployeeController::class);
    Route::apiResource('shifts', ShiftController::class);
    
    // Schedules
    Route::post('/schedules/generate', [ScheduleController::class, 'generate']);
    Route::get('/schedules/summary', [ScheduleController::class, 'summary']);
    Route::apiResource('schedules', ScheduleController::class);
    
    // Stock transactions
    Route::get('/stock-summary', [StockTransactionController::class, 'stockSummary']);
    Route::apiResource('stock-transactions', StockTransactionController::class)->only(['index', 'store', 'show']);
});
