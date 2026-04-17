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
        Schema::create('trans_voucher_usages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_voucher')->constrained('vouchers');
            $table->foreignId('id_order')->constrained('trans_orders');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trans_voucher_usages');
    }
};
