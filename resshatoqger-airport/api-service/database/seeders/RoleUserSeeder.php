<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class RoleUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Super Admin
        DB::table('users')->updateOrInsert(
            ['email' => 'super@admin.com'],
            [
                'name' => 'Super Administrator',
                'password' => Hash::make('password'),
                'role' => 'super_admin',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // 2. Operator (Admin Penerbangan)
        DB::table('users')->updateOrInsert(
            ['email' => 'operator@admin.com'],
            [
                'name' => 'Flight Operator',
                'password' => Hash::make('password'),
                'role' => 'operator',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // 3. Customer Service (Read Only)
        DB::table('users')->updateOrInsert(
            ['email' => 'cs@admin.com'], // Using cs@admin.com to clearly mark them as admin-level access
            [
                'name' => 'Customer Service',
                'password' => Hash::make('password'),
                'role' => 'cs',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // 4. Regular User
        DB::table('users')->updateOrInsert(
            ['email' => 'budi@user.com'],
            [
                'name' => 'Budi User',
                'password' => Hash::make('password'),
                'role' => 'user',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
}
