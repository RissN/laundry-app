<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Level::insert([
            ['level_name' => 'Admin'],
            ['level_name' => 'Operator'],
            ['level_name' => 'Pimpinan'],
        ]);
    }
}
