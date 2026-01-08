<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FlightResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'flight_number' => $this->flight_number,
            'airline' => new AirlineResource($this->whenLoaded('airline')),
            'origin' => new AirportResource($this->whenLoaded('origin')),
            'destination' => new AirportResource($this->whenLoaded('destination')),
            'departure_time' => $this->departure_time,
            'arrival_time' => $this->arrival_time,
            'price' => $this->price,
            'capacity' => $this->capacity,
        ];
    }
}
