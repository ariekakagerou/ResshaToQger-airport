<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AirlineSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $filesUrl = config('app.url');
        
        DB::table('airlines')->insert([
            [
                'name' => 'Garuda Indonesia',
                'code' => 'GA',
                'logo' => $filesUrl . '/assets/logo.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Lion Air',
                'code' => 'JT',
                'logo' => $filesUrl . '/assets/logo1.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'AirAsia Indonesia',
                'code' => 'QZ',
                'logo' => $filesUrl . '/assets/logo.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Singapore Airlines',
                'code' => 'SQ',
                'logo' => $filesUrl . '/assets/logo1.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
