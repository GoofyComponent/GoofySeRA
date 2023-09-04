<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VideoReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // On va prendre les projets 3 et 4

        $project1 = \App\Models\Project::find(3);
        $project2 = \App\Models\Project::find(4);

        $ressource1 = \App\Models\Ressource::factory()->create([
            'name' => 'Top 5 Freddy Fazbear',
            'description' => 'Top 5 des meilleurs Freddy Fazbear de la saga Five Nights at Freddy\'s !',
            'type' => 'video',
            'url' => '/top5freddy.mp4',
            'project_id' => $project1->id,
        ]);

        $ressource2 = \App\Models\Ressource::factory()->create([
            'name' => 'Top 5 Freddy Fazbear',
            'description' => 'Top 5 des meilleurs Freddy Fazbear de la saga Five Nights at Freddy\'s !',
            'type' => 'video',
            'url' => '/top5freddy.mp4',
            'project_id' => $project2->id,
        ]);

        // on va créer grace a la factory 1 table video pour chaque projet
        $video1 = \App\Models\VideoReview::factory()->create([
            'project_id' => $project1->id,
            'ressource_id' => $ressource1->id,
        ]);

        $video2 = \App\Models\VideoReview::factory()->create([
            'project_id' => $project2->id,
            'ressource_id' => $ressource2->id,
        ]);
    }
}
