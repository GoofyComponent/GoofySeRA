<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
class ApiKey extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // for each cursus_director we create an api_key
        $users = User::where('role', 'cursus_director')->get();
        foreach ($users as $user) {
            \App\Models\ApiKey::factory()->count(1)->create([
                'user_id' => $user->id,
            ]);
        }



    }
}
