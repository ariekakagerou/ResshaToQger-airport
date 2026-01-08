<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Flight;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BookingManualController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'flight_id' => 'required|exists:flights,id',
            'passenger_name' => 'required|string',
            'passenger_email' => 'required|email',
            'passengers_count' => 'required|integer|min:1',
            'payment_status' => 'required|in:paid,unpaid',
            'payment_method' => 'required|string',
            'pay_amount' => 'nullable|numeric' // New field: Amount given by customer
        ]);

        $flight = Flight::findOrFail($validated['flight_id']);
        
        // Calculations
        $flightPriceTotal = $flight->price * $validated['passengers_count'];
        $adminFee = 50000; // Flat IDR 50.000 Admin Fee per transaction
        $totalPrice = $flightPriceTotal + $adminFee;

        $payAmount = $validated['pay_amount'] ?? $totalPrice;
        $changeAmount = $payAmount - $totalPrice;

        if ($changeAmount < 0 && $validated['payment_status'] === 'paid') {
            return response()->json(['message' => 'Pembayaran kurang!'], 400);
        }

        $user = User::where('email', $validated['passenger_email'])->first();
        $userId = $user ? $user->id : $request->user()->id; 

        $booking = Booking::create([
            'user_id' => $userId,
            'flight_id' => $flight->id,
            'booking_code' => strtoupper(Str::random(6)),
            'status' => $validated['payment_status'] === 'paid' ? 'confirmed' : 'pending',
            'total_price' => $totalPrice, // Grand Total
            'admin_fee' => $adminFee,
            'pay_amount' => $payAmount,
            'change_amount' => $changeAmount,
            'payment_method' => $validated['payment_method'],
            'passenger_name' => $validated['passenger_name'],
            'passenger_email' => $validated['passenger_email'],
        ]);

        return response()->json(['message' => 'Booking Created', 'data' => $booking->load('flight.origin', 'flight.destination')], 201);
    }
}
