<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Airline;
use Illuminate\Http\Request;

class AirlineController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return \App\Http\Resources\AirlineResource::collection(\App\Models\Airline::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:airlines,code|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('airlines', 'airport_assets');
            $validated['logo'] = \Illuminate\Support\Facades\Storage::disk('airport_assets')->url($path);
        }

        $airline = \App\Models\Airline::create($validated);

        return new \App\Http\Resources\AirlineResource($airline);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $airline = \App\Models\Airline::findOrFail($id);
        return new \App\Http\Resources\AirlineResource($airline);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $airline = \App\Models\Airline::findOrFail($id);
        $validated = $request->validate([
            'name' => 'string|max:255',
            'code' => 'string|unique:airlines,code,' . $id . '|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            // Optional: Delete old logo
            // if ($airline->logo) { ... }
            
            $path = $request->file('logo')->store('airlines', 'airport_assets');
            $validated['logo'] = \Illuminate\Support\Facades\Storage::disk('airport_assets')->url($path);
        }

        $airline->update($validated);
        return new \App\Http\Resources\AirlineResource($airline);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $airline = \App\Models\Airline::findOrFail($id);
        
        // Delete logo if exists
        if ($airline->logo) {
            $path = str_replace(url('/assets') . '/', '', $airline->logo);
            \Illuminate\Support\Facades\Storage::disk('airport_assets')->delete($path);
        }

        $airline->delete();
        return response()->noContent();
    }
}
