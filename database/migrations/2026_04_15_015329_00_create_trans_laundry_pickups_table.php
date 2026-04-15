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
        Schema::create('trans_laundry_pickups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_order')->constrained('trans_orders');
            $table->foreignId('id_customer')->constrained('customers');
            $table->dateTime('pickup_date');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trans_laundry_pickups');
    }
};
