<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CalculationHistoryController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\LeaveRequestController;
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

// --- SAAS ADMIN ROUTES (Tanpa Tenant Scope) ---
Route::prefix('saas')->group(function () {
    Route::post('/login', [\App\Http\Controllers\SaaS\AuthController::class, 'login']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [\App\Http\Controllers\SaaS\AuthController::class, 'me']);
        Route::post('/logout', [\App\Http\Controllers\SaaS\AuthController::class, 'logout']);
        
        Route::get('/tenants', [\App\Http\Controllers\SaaS\TenantController::class, 'index']);
        Route::post('/tenants', [\App\Http\Controllers\SaaS\TenantController::class, 'store']);
        Route::put('/tenants/{id}', [\App\Http\Controllers\SaaS\TenantController::class, 'update']);
        Route::patch('/tenants/{id}/toggle-status', [\App\Http\Controllers\SaaS\TenantController::class, 'toggleStatus']);
        Route::delete('/tenants/{id}', [\App\Http\Controllers\SaaS\TenantController::class, 'destroy']);
    });
});
// ----------------------------------------------

// --- MOBILE APP ROUTES ---
Route::prefix('mobile')->group(function () {
    Route::post('/login', [\App\Http\Controllers\CustomerVerApi\AuthController::class, 'login']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [\App\Http\Controllers\CustomerVerApi\AuthController::class, 'me']);
        Route::post('/logout', [\App\Http\Controllers\CustomerVerApi\AuthController::class, 'logout']);
        
        // Nanti bisa ditambahkan endpoint khusus mobile lainnya di sini
    });
});
// ----------------------------------------------

// --- PERSONAL APP ROUTES (LumiFit – non-nakes) ---
Route::prefix('personal')->group(function () {
    // Public
    Route::post('/register', [\App\Http\Controllers\Personal\AuthController::class, 'register']);
    Route::post('/login',    [\App\Http\Controllers\Personal\AuthController::class, 'login']);

    // Protected
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me',      [\App\Http\Controllers\Personal\AuthController::class, 'me']);
        Route::put('/me',      [\App\Http\Controllers\Personal\AuthController::class, 'updateProfile']);
        Route::post('/logout', [\App\Http\Controllers\Personal\AuthController::class, 'logout']);

        // Weight logs – bulk sync from device + retrieval
        Route::post('/weight-logs/sync', [\App\Http\Controllers\Personal\WeightLogController::class, 'sync']);
        Route::get('/weight-logs',       [\App\Http\Controllers\Personal\WeightLogController::class, 'index']);

        // Activity logs – bulk sync from device + retrieval
        Route::post('/activity-logs/sync', [\App\Http\Controllers\Personal\ActivityLogController::class, 'sync']);
        Route::get('/activity-logs',       [\App\Http\Controllers\Personal\ActivityLogController::class, 'index']);

        // Water logs
        Route::post('/water-logs/sync', [\App\Http\Controllers\Personal\WaterLogController::class, 'sync']);
        Route::get('/water-logs',       [\App\Http\Controllers\Personal\WaterLogController::class, 'index']);
    });
});
// -------------------------------------------------

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
    
    // Leave Requests
    Route::post('/leave-requests/{id}/approve', [LeaveRequestController::class, 'approve']);
    Route::post('/leave-requests/{id}/reject', [LeaveRequestController::class, 'reject']);
    Route::apiResource('leave-requests', LeaveRequestController::class);
    
    // Stock transactions
    Route::get('/stock-summary', [StockTransactionController::class, 'stockSummary']);
    Route::apiResource('stock-transactions', StockTransactionController::class)->only(['index', 'store', 'show']);
    
    // Calculation History
    Route::get('/calculation-history', [CalculationHistoryController::class, 'index']);
    Route::post('/calculation-history', [CalculationHistoryController::class, 'store']);
    Route::get('/calculation-history/{id}', [CalculationHistoryController::class, 'show']);
    Route::delete('/calculation-history/{id}', [CalculationHistoryController::class, 'destroy']);
    Route::delete('/calculation-history', [CalculationHistoryController::class, 'destroyAll']);

    // Nutritional Visits
    Route::apiResource('nutritional-visits', \App\Http\Controllers\NutritionalVisitController::class);

    // Diets
    Route::apiResource('diets', \App\Http\Controllers\DietController::class);

    // Food Management (Master Data Nutrisi)
    Route::get('/foods/external', [\App\Http\Controllers\FoodController::class, 'searchExternal']);
    Route::get('/foods/tkpi', [\App\Http\Controllers\FoodController::class, 'searchTkpi']);
    Route::apiResource('foods', \App\Http\Controllers\FoodController::class);

    // Meals / Food Recall 24h
    Route::apiResource('meals', \App\Http\Controllers\MealController::class)->except(['update', 'show']);

    // Nutrition Calculator Requirements
    Route::post('nutrition-calculator/requirements', [\App\Http\Controllers\NutritionRequirementController::class, 'calculate']);
    Route::get('nutrition-calculator/target/{patient}', [\App\Http\Controllers\NutritionRequirementController::class, 'getLatestTarget']);

    // Nutrition Plans (Menu Planner)
    Route::apiResource('nutrition-plans', \App\Http\Controllers\NutritionPlanController::class)->except(['update']);
    Route::put('nutrition-plans/{id}/items', [\App\Http\Controllers\NutritionPlanController::class, 'updateItems']);

    // Patients lookup & CRUD
    Route::apiResource('patients', \App\Http\Controllers\PatientController::class);
});
