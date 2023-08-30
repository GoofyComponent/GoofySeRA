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
        $randomLastName = [
            "Alexander",
            "Arthur",
            "Avery",
            "Bennett",
            "Caleb",
            "Carter",
            "Charles",
            "Christian",
            "Christopher",
            "Daniel",
            "David",
            "Dylan",
            "Elijah",
            "Albuquerque",
            "Alcott",
            "Grousset",
        ];

        // Create an user for each role in the roles config file
        foreach (config('roles') as $role => $value) {
            // if email already exists, skip
            if (\App\Models\User::where('email', $role . '@sera.com')->first()) {
                continue;
            }

            \App\Models\User::factory()->create([
                'lastname' => $randomLastName[array_rand($randomLastName)],
                'email' => $role . '@sera.com',
                'password' => bcrypt('password'),
                'role' => $role
            ]);

            $this->command->info('User ' . $role . ' created');
        }
    }
}
