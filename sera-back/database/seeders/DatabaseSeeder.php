<?php

namespace Database\Seeders;

use App\Models\RoomReservation;
use App\Models\Team;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $this->call([
            UserSeeder::class,
            ProjectRequestSeeder::class,
            ProjectSeeder::class,
            TeamSeeder::class,
            RoomSeeder::class,
            RoomReservationSeeder::class,
            // // RessourceSeeder::class,
            // VideoReviewSeeder::class,
            NotificationSeeder::class,
            KnowledgeSeeder::class,
            ApiKey::class,
        ]);
    }
}
