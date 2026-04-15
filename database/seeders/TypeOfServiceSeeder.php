<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TypeOfServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\TypeOfService::insert([
            ['service_name' => 'Cuci & Gosok', 'price' => 5000, 'description' => 'Harga per kg'],
            ['service_name' => 'Hanya Cuci', 'price' => 4500, 'description' => 'Harga per kg'],
            ['service_name' => 'Hanya Gosok', 'price' => 5000, 'description' => 'Harga per kg'],
            ['service_name' => 'Laundry Besar', 'price' => 7000, 'description' => 'Harga per kg untuk bed cover dsb'],
        ]);
    }
}
