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

        // on va créer grace a la factory 1 table video pour chaque projet
        $video1 = \App\Models\VideoReview::factory()->create([
            'project_id' => $project1->id,
        ]);

        $video2 = \App\Models\VideoReview::factory()->create([
            'project_id' => $project2->id,
        ]);

        // Video 1 sera comme si on venait de finir la capture et commencer l'editing

        // Video 2 on aura déjà commencer

        $jsonReview = [
            [
                "version" => 1,
                "video" => [
                    "type" => "video",
                    "title" => "Fuji",
                    "sources" => [
                        [
                            "size" => 1440,
                            "provider" => "html",
                            "src" => "http://localhost/storage/videos-example/fuji-1440.mp4",
                            "type" => "video/mp4",
                        ],
                        [
                            "size" => 720,
                            "provider" => "html",
                            "src" => "http://localhost/storage/videos-example/fuji-720.mp4",
                            "type" => "video/mp4",
                        ],
                    ],
                ],
                "comments" => [
                    [
                        "author"=> [
                            "nickname"=> "user1",
                            "avatar"=> "https://i.pravatar.cc/300",
                            "job"=> "Software Engineer"
                        ],
                        "message"=> "hello",
                        "timestamp"=> "2021-05-01 12:00:00"
                    ],
                    [
                        "author"=> [
                            "nickname"=> "user2",
                            "avatar"=> "https://i.pravatar.cc/300",
                            "job"=> "Barista"
                        ],
                        "message"=> "hello",
                        "timestamp"=> "2021-05-01 12:00:00"
                    ],
                ]
            ],
        ];

        $video2->version = json_encode($jsonReview);

        $video2->save();
    }
}
