<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Airport extends Model
{
    protected $fillable = ['code', 'name', 'city', 'country'];

    public function departures()
    {
        return $this->hasMany(Flight::class, 'origin_code', 'code');
    }

    public function arrivals()
    {
        return $this->hasMany(Flight::class, 'destination_code', 'code');
    }
}
