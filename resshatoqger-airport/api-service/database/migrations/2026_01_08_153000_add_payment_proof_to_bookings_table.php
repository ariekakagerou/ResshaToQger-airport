<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->string('payment_proof')->nullable(); // Path to image
            // We'll use the existing 'status' field.
            // Add 'waiting_confirmation' to status enum if possible? 
            // Laravel Enum modification in migration is tricky for raw SQL, 
            // but since status is likely a string or we can just treat it as string, it's fine.
            // If it was defined as table->enum(), we might need a raw statement.
            // Let's check previous migration.
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn('payment_proof');
        });
    }
};
