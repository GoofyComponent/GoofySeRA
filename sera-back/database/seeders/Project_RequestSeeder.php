<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class Project_RequestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // get the first user with cursus_director role
        $cursus_director = User::where('role', 'cursus_director')->first();

        for($i=1; $i<4; $i++){
            \App\Models\Project_Request::factory()->create([
                'user_id' => $cursus_director->id,
                'priority' => $i,
            ]);
        }
    }
}
