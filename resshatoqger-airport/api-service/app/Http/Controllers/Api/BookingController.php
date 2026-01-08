<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Flight;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class BookingController extends Controller
{
    // ... index, show, existing methods ...

    public function index(Request $request) { /* ... */  
         $bookings = Booking::where('user_id', $request->user()->id)
            ->with(['flight.airline', 'flight.origin', 'flight.destination'])
            ->latest()
            ->paginate(10);
        return response()->json($bookings);
    }
    
    public function show(Request $request, string $id) { /* ... */ 
         $booking = Booking::with(['flight.airline', 'flight.origin', 'flight.destination'])
            ->findOrFail($id);

        if ($request->user()->role !== 'admin' && $request->user()->role !== 'super_admin' && $request->user()->role !== 'operator' && $booking->user_id !== $request->user()->id) {
             return response()->json(['message' => 'Unauthorized'], 403);
        }
        return response()->json(['data' => $booking]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'flight_id' => 'required|exists:flights,id',
            'passenger_name' => 'required|string',
            'passenger_email' => 'nullable|email',
            'passenger_phone' => 'nullable|string',
            'passengers_count' => 'required|integer|min:1' // New Field
        ]);

        $flight = Flight::findOrFail($request->flight_id);
        
        // New Calculation logic
        $count = $validated['passengers_count'];
        $ticketPrice = $flight->price * $count; 
        $adminFee = 25000; // Flat fee or could be per passenger? Usually Flat per transaction.
        $totalPrice = $ticketPrice + $adminFee;
        
        $booking = Booking::create([
            'user_id' => $request->user()->id,
            'flight_id' => $flight->id,
            'booking_code' => 'BK-' . strtoupper(Str::random(6)),
            'passenger_name' => $request->passenger_name,
            'passenger_email' => $request->passenger_email ?? $request->user()->email,
            'passenger_phone' => $request->passenger_phone,
            'passengers_count' => $count,
            'total_price' => $totalPrice, 
            'admin_fee' => $adminFee,
            'payment_method' => 'TRANSFER', 
            'status' => 'pending'
        ]);

        return response()->json([
            'message' => 'Booking created. Please upload payment proof.',
            'data' => $booking->load(['flight.airline'])
        ], 201);
    }

    public function uploadProof(Request $request, $id) { /* ... */
        $request->validate([
            'payment_proof' => 'required|image|max:2048'
        ]);

        $booking = Booking::where('user_id', $request->user()->id)->findOrFail($id);
        
        if ($request->hasFile('payment_proof')) {
            $path = $request->file('payment_proof')->store('payment_proofs', 'public');
            
            $booking->update([
                'payment_proof' => $path,
                'status' => 'waiting_confirmation'
            ]);
            
            return response()->json(['message' => 'Bukti pembayaran berhasil diupload. Menunggu verifikasi admin.']);
        }
        return response()->json(['message' => 'File error'], 400); 
    }
    
    public function verifyPayment(Request $request, $id) { /* ... */ 
        if (!in_array($request->user()->role, ['admin', 'super_admin', 'operator'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $booking = Booking::findOrFail($id);
        $action = $request->input('action'); 
        
        if ($action === 'approve') {
            $booking->update([
                'status' => 'confirmed',
                'pay_amount' => $booking->total_price 
            ]);
        } else {
            $booking->update(['status' => 'cancelled']);
        }

        return response()->json(['message' => 'Payment ' . $action . 'd']); 
    }
}
