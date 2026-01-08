<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class AdminController extends Controller
{
    public function stats()
    {
        // Total Income (Paid confirmed bookings + Manually paid bookings)
        // Adjust logic: Only 'confirmed' status or 'paid' status bookings contribute.
        // Assuming 'confirmed' implies paid for online, or manual sets it to confirmed.
        $totalIncome = Booking::whereIn('status', ['confirmed', 'paid', 'completed'])->sum('pay_amount') 
                       // Fallback to total_price if pay_amount is null (legacy data)
                       + Booking::whereIn('status', ['confirmed', 'paid', 'completed'])->whereNull('pay_amount')->sum('total_price');

        $activeFlights = \App\Models\Flight::where('departure_time', '>', now())->count();
        $totalBookings = Booking::count();
        $pendingTasks = Task::where('status', 'pending')->count();

        // Recent Bookings
        $recentBookings = Booking::with(['user', 'flight.airline'])
            ->latest()
            ->take(5)
            ->get();

        // Sales Chart (Last 7 Days)
        $salesData = [];
        $today = Carbon::today();
        for ($i = 6; $i >= 0; $i--) {
            $date = $today->copy()->subDays($i)->format('Y-m-d');
            $dailySum = Booking::whereDate('created_at', $date)
                ->whereIn('status', ['confirmed', 'paid', 'completed'])
                ->sum('pay_amount'); // Simplified
            
            // Format for Chart (Day Name)
            $dayName = $today->copy()->subDays($i)->format('D'); // Mon, Tue...
            
            $salesData[] = [
                'name' => $dayName,
                'total' => (int)$dailySum
            ];
        }

        return response()->json([
            'total_income' => $totalIncome,
            'active_flights' => $activeFlights,
            'total_bookings' => $totalBookings,
            'pending_tasks' => $pendingTasks,
            'recent_bookings' => $recentBookings,
            'sales_chart' => $salesData
        ]);
    }

    public function allBookings()
    {
        $bookings = Booking::with(['user', 'flight.airline', 'flight.origin', 'flight.destination'])
            ->latest()
            ->paginate(50);

        return response()->json($bookings);
    }
}
