<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use Illuminate\Http\Request;

class AirportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return \App\Http\Resources\AirportResource::collection(\App\Models\Airport::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:airports,code|max:3|uppercase',
            'city' => 'required|string|max:255',
            'country' => 'required|string|max:255',
        ]);

        $airport = \App\Models\Airport::create($validated);

        return new \App\Http\Resources\AirportResource($airport);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $airport = \App\Models\Airport::findOrFail($id);
        return new \App\Http\Resources\AirportResource($airport);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $airport = \App\Models\Airport::findOrFail($id);
        $validated = $request->validate([
            'name' => 'string|max:255',
            'code' => 'string|unique:airports,code,' . $id . '|max:3|uppercase',
            'city' => 'string|max:255',
            'country' => 'string|max:255',
        ]);

        $airport->update($validated);
        return new \App\Http\Resources\AirportResource($airport);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $airport = \App\Models\Airport::findOrFail($id);
        $airport->delete();
        return response()->noContent();
    }
}
