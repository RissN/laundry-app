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
        Schema::table('trans_orders', function (Blueprint $table) {
            $table->foreignId('id_voucher')->nullable()->constrained('vouchers')->after('id_customer');
            $table->integer('discount_percent')->default(0)->after('tax');
            $table->integer('discount_amount')->default(0)->after('discount_percent');
            $table->integer('final_total')->nullable()->after('discount_amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('trans_orders', function (Blueprint $table) {
            $table->dropForeign(['id_voucher']);
            $table->dropColumn(['id_voucher', 'discount_percent', 'discount_amount', 'final_total']);
        });
    }
};
