<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AirportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('airports')->insert([
            [
                'code' => 'CGK',
                'name' => 'Soekarno-Hatta International Airport',
                'city' => 'Jakarta',
                'country' => 'Indonesia',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'DPS',
                'name' => 'Ngurah Rai International Airport',
                'city' => 'Bali',
                'country' => 'Indonesia',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'SIN',
                'name' => 'Changi Airport',
                'city' => 'Singapore',
                'country' => 'Singapore',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'HND',
                'name' => 'Haneda Airport',
                'city' => 'Tokyo',
                'country' => 'Japan',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'NRT',
                'name' => 'Narita International Airport',
                'city' => 'Tokyo',
                'country' => 'Japan',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
