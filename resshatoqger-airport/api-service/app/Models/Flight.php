<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Flight extends Model
{
    protected $fillable = [
        'airline_id',
        'flight_number',
        'origin_code',
        'destination_code',
        'departure_time',
        'arrival_time',
        'price',
        'capacity'
    ];

    public function airline()
    {
        return $this->belongsTo(Airline::class);
    }

    public function origin()
    {
        return $this->belongsTo(Airport::class, 'origin_code', 'code');
    }

    public function destination()
    {
        return $this->belongsTo(Airport::class, 'destination_code', 'code');
    }
}
