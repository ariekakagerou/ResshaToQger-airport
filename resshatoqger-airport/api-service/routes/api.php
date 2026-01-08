<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AirlineController;
use App\Http\Controllers\Api\AirportController;
use App\Http\Controllers\Api\FlightController;
use App\Http\Controllers\Api\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('airlines', AirlineController::class);
Route::apiResource('airports', AirportController::class);
Route::apiResource('flights', FlightController::class);

// Public Check-In Search
Route::post('/bookings/search', [\App\Http\Controllers\Api\CheckInController::class, 'search']);

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('bookings', \App\Http\Controllers\Api\BookingController::class);
    Route::post('/bookings/{id}/upload-proof', [\App\Http\Controllers\Api\BookingController::class, 'uploadProof']);
    
    // Check-In Routes (Protected for Seat Selection)
    Route::get('/bookings/{id}/seat-map', [\App\Http\Controllers\Api\CheckInController::class, 'getSeatMap']);
    Route::post('/bookings/{id}/check-in', [\App\Http\Controllers\Api\CheckInController::class, 'store']);

    // Task Routes for Employees
    Route::get('/tasks/my-tasks', [\App\Http\Controllers\Api\TaskController::class, 'myTasks']);
    Route::put('/tasks/{id}/status', [\App\Http\Controllers\Api\TaskController::class, 'updateStatus']);

    // Admin Routes - Protected by 'admin' middleware
    Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
        Route::get('/stats', [\App\Http\Controllers\Api\AdminController::class, 'stats']);
        Route::get('/bookings', [\App\Http\Controllers\Api\AdminController::class, 'allBookings']);
        Route::post('/bookings/{id}/verify', [\App\Http\Controllers\Api\BookingController::class, 'verifyPayment']);

        // Task Management (Super Admin)
        Route::get('/tasks/all', [\App\Http\Controllers\Api\TaskController::class, 'index']);
        Route::post('/tasks', [\App\Http\Controllers\Api\TaskController::class, 'store']);
        Route::get('/tasks/assignees', [\App\Http\Controllers\Api\TaskController::class, 'getAssignees']);
        
        // Manual Booking
        Route::post('/bookings/manual', [\App\Http\Controllers\Api\BookingManualController::class, 'store']);
    });
});
