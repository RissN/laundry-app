<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\User::create([
            'id_level'   => 1,
            'name'       => 'Administrator',
            'email'      => 'admin@laundry.com',
            'password'   => \Illuminate\Support\Facades\Hash::make('password'),
        ]);
    }
}
