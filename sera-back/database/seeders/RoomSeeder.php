<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Room::factory()->count(10)->create();

        $roomNames = [
            "Salle beethoven",
            "Salle mozart",
            "Salle bach",
            "Salle chopin",
            "Salle vivaldi",
            "Salle schubert",
            "Salle brahms",
            "Salle haydn",
            "Salle liszt",
            "Salle wagner",
            "Salle verdi",
            "Salle tchaikovsky",
            "Salle strauss",
            "Salle debussy",
        ];

        $roomDescription = [
            "A105 - 8 Rue des sorbiers, 94225, City",
            "A106 - 8 Rue des sorbiers, 94225, City",
            "A107 - 8 Rue des sorbiers, 94225, City",
            "A108 - 8 Rue des sorbiers, 94225, City",
            "A109 - 8 Rue des sorbiers, 94225, City",
            "A110 - 8 Rue des sorbiers, 94225, City",
            "B104 - 8 Rue des sorbiers, 94225, City",
            "B105 - 8 Rue des sorbiers, 94225, City",
            "B106 - 8 Rue des sorbiers, 94225, City",
            "B107 - 8 Rue des sorbiers, 94225, City",
            "Auditorium - 4 allée des sorbiers, 94225, City",
        ];

        $index = 0;
        //Add a uniq name and a random description to each room
        foreach (\App\Models\Room::all() as $room) {
            $room->name = $roomNames[$index];
            $room->description = $roomDescription[array_rand($roomDescription)];
            $room->save();
            $index++;
        }

    }
}