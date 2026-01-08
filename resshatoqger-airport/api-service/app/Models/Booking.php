<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'flight_id',
        'booking_code',
        'passenger_name',
        'passenger_email',
        'passenger_phone',
        'passengers_count',
        'total_price',
        'status',
        'admin_fee',
        'pay_amount',
        'change_amount',
        'payment_method',
        'payment_proof',
        'seat_number',
        'is_checked_in'
    ];

    public function flight()
    {
        return $this->belongsTo(Flight::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
