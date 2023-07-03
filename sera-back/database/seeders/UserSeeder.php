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
        // Create an user for each role in the roles config file
        foreach (config('roles') as $role) {
            // if email already exists, skip
            if (\App\Models\User::where('email', $role . '@sera.com')->first()) {
                continue;
            }

            \App\Models\User::factory()->create([
                'lastname' => $role,
                'email' => $role . '@sera.com',
                'password' => bcrypt('password'),
                'role' => $role
            ]);

            $this->command->info('User ' . $role . ' created');
        }
    }
}
