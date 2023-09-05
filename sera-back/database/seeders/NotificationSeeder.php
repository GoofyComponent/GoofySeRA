<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // on récupère tous les utilisateurs
        $users = \App\Models\User::all(["*"]);

        // on crée 10 notifications par utilisateur
        foreach ($users as $user) {
            \App\Models\Notification::factory()->count(10)->create([
                "user_id" => $user->id,
            ]);
        }
    }
}
