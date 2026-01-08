<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Airline;
use App\Models\Airport;
use Carbon\Carbon;

class FlightSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure we have IDs if we are using Eloquent, but since we are seeding, we might need to fetch IDs
        // Or just hardcode logic assuming the previous seeders ran.
        // Let's use more robust logic by looking up IDs/Codes.
        
        $garuda = Airline::where('code', 'GA')->first();
        $cgk = Airport::where('code', 'CGK')->first();
        $dps = Airport::where('code', 'DPS')->first();
        $sin = Airport::where('code', 'SIN')->first();
        
        if (!$garuda || !$cgk || !$dps) {
             // Fallback or skip if models aren't ready/seeded yet, but let's assume they will be.
             return;
        }

        $flights = [];
        
        // Flight 0: JKT -> Bali (Today)
        $flights[] = [
            'airline_id' => $garuda->id,
            'flight_number' => 'GA402',
            'origin_code' => 'CGK',
            'destination_code' => 'DPS',
            'departure_time' => Carbon::now()->setHour(8)->setMinute(0),
            'arrival_time' => Carbon::now()->setHour(10)->setMinute(50),
            'price' => 1500000.00,
            'capacity' => 180,
            'created_at' => now(),
            'updated_at' => now(),
        ];

        // Flight 1: JKT -> Bali (Tomorrow)
        $flights[] = [
            'airline_id' => $garuda->id,
            'flight_number' => 'GA404',
            'origin_code' => 'CGK',
            'destination_code' => 'DPS',
            'departure_time' => Carbon::now()->addDay()->setHour(10)->setMinute(0),
            'arrival_time' => Carbon::now()->addDay()->setHour(12)->setMinute(50),
            'price' => 1500000.00,
            'capacity' => 180,
            'created_at' => now(),
            'updated_at' => now(),
        ];

        // Flight 2: Bali -> JKT (Tomorrow + 2 days)
        $flights[] = [
            'airline_id' => $garuda->id,
            'flight_number' => 'GA405',
            'origin_code' => 'DPS',
            'destination_code' => 'CGK',
            'departure_time' => Carbon::now()->addDays(2)->setHour(14)->setMinute(0),
            'arrival_time' => Carbon::now()->addDays(2)->setHour(16)->setMinute(50),
            'price' => 1450000.00,
            'capacity' => 180,
            'created_at' => now(),
            'updated_at' => now(),
        ];

        // Flight 3: JKT -> Singapore (Tomorrow)
        $flights[] = [
            'airline_id' => $garuda->id,
            'flight_number' => 'GA836',
            'origin_code' => 'CGK',
            'destination_code' => 'SIN',
            'departure_time' => Carbon::now()->addDay()->setHour(8)->setMinute(30),
            'arrival_time' => Carbon::now()->addDay()->setHour(11)->setMinute(15),
            'price' => 2500000.00,
            'capacity' => 200,
            'created_at' => now(),
            'updated_at' => now(),
        ];

        DB::table('flights')->insert($flights);
    }
}
