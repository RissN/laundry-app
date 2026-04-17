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
            $table->unsignedBigInteger('id_customer')->nullable()->change();
            $table->string('non_member_name')->nullable()->after('id_customer');
            $table->string('non_member_phone')->nullable()->after('non_member_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('trans_orders', function (Blueprint $table) {
            $table->unsignedBigInteger('id_customer')->nullable(false)->change();
            $table->dropColumn(['non_member_name', 'non_member_phone']);
        });
    }
};
