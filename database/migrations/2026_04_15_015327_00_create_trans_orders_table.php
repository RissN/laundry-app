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
        Schema::create('trans_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_customer')->constrained('customers');
            $table->string('order_code', 50);
            $table->date('order_date');
            $table->date('order_end_date')->nullable();
            $table->tinyInteger('order_status')->default(0);
            $table->integer('order_pay')->nullable();
            $table->integer('order_change')->nullable();
            $table->integer('total')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trans_orders');
    }
};
