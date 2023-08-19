<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class ProjectRequestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // get the first user with cursus_director role
        $cursus_director = User::where('role', 'cursus_director')->first();
        $priorityArray = ["low", "medium", "high"];
        for ($i = 0; $i < 60; $i++) {
            $priority = $priorityArray[$i % 3];
            \App\Models\ProjectRequest::factory()->create([
                'user_id' => $cursus_director->id,
                'priority' => $priorityArray[$i % 3],
                'status' => 'pending',
            ]);
        }
    }
}