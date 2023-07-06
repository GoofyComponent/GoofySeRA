<?php

namespace Database\Seeders;

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
            TeamSeeder::class,
            ProjectRequestSeeder::class,
            ProjectSeeder::class,
            TeamSeeder::class,
        ]);
    }
}
