<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Flight;
use Illuminate\Http\Request;

class FlightController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = \App\Models\Flight::query();

        if ($request->has('origin')) {
            $query->where('origin_code', $request->input('origin'));
        }

        if ($request->has('destination')) {
            $query->where('destination_code', $request->input('destination'));
        }

        if ($request->has('date')) {
            $query->whereDate('departure_time', $request->input('date'));
        }

        $flights = $query->with(['airline', 'origin', 'destination'])->paginate(10);

        return \App\Http\Resources\FlightResource::collection($flights);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'airline_id' => 'required|exists:airlines,id',
            'flight_number' => 'required|string',
            'origin_code' => 'required|exists:airports,code',
            'destination_code' => 'required|exists:airports,code|different:origin_code',
            'departure_time' => 'required|date',
            'arrival_time' => 'required|date|after:departure_time',
            'price' => 'required|numeric|min:0',
            'capacity' => 'required|integer|min:1',
        ]);

        $flight = \App\Models\Flight::create($validated);

        return new \App\Http\Resources\FlightResource($flight);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $flight = \App\Models\Flight::with(['airline', 'origin', 'destination'])->findOrFail($id);
        return new \App\Http\Resources\FlightResource($flight);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $flight = \App\Models\Flight::findOrFail($id);
        $validated = $request->validate([
            'airline_id' => 'exists:airlines,id',
            'flight_number' => 'string',
            'origin_code' => 'exists:airports,code',
            'destination_code' => 'exists:airports,code|different:origin_code',
            'departure_time' => 'date',
            'arrival_time' => 'date|after:departure_time',
            'price' => 'numeric|min:0',
            'capacity' => 'integer|min:1',
        ]);

        $flight->update($validated);
        return new \App\Http\Resources\FlightResource($flight);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $flight = \App\Models\Flight::findOrFail($id);
        $flight->delete();
        return response()->noContent();
    }
}
