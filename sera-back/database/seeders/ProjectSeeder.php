<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\Ressource;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Project::factory()->count(8)->create();

        // Projet 1 -> Planning
        $project = \App\Models\Project::find(1);
        $project->steps = json_decode($project->steps);
        $project->steps->Planning->status = 'ongoing';
        $project->steps = json_encode($project->steps);
        $project->save();

        // Captation sans lien - Team + Un salle réservé
        $project = \App\Models\Project::find(2);
        $project->steps = json_decode($project->steps);
        $project->steps->Planning->status = 'done';
        $project->steps->Capture->status = 'ongoing';
        $project->steps = json_encode($project->steps);
        $project->save();

        // Project 3 -> Captation avec lien -  Team + Lien + Une salle réservé
        $project = \App\Models\Project::find(3);
        $project->steps = json_decode($project->steps);
        $project->steps->Planning->status = 'done';
        $project->steps->Capture->status = 'ongoing';
        $project->steps = json_encode($project->steps);
        $project->save();
        $ressource = new Ressource();
        $ressource->name = 'Captation url';
        $ressource->type = 'Captation url';
        $ressource->description = 'Captation url';
        $ressource->url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
        $ressource->project_id = $project->id;
        $ressource->save();

        // Project 4 -> PostProd Avec 0 Review - Team + Lien Captation + Capation finit + Une salle réservé
        $project = \App\Models\Project::find(4);
        $project->steps = json_decode($project->steps);
        $project->steps->Planning->status = 'done';
        $project->steps->Capture->status = 'done';
        $project->steps->{'Post-Production'}->status = 'ongoing';
        $project->steps = json_encode($project->steps);
        $project->save();
        $ressource = new Ressource();
        $ressource->name = 'Captation url';
        $ressource->type = 'Captation url';
        $ressource->description = 'Captation url';
        $ressource->url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
        $ressource->project_id = $project->id;
        $ressource->save();


        // Project 5-> Post Prod avec 1 Review + Team + Lien Captation + Capation finit + Une salle réservé + ajout video + commentaire
        $project = \App\Models\Project::find(5);
        $project->steps = json_decode($project->steps);
        $project->steps->Planning->status = 'done';
        $project->steps->Capture->status = 'done';
        $project->steps->{'Post-Production'}->status = 'ongoing';
        $project->steps = json_encode($project->steps);
        $project->save();


        $ressource = new Ressource();
        $ressource->name = 'Captation url';
        $ressource->type = 'Captation url';
        $ressource->description = 'Captation url';
        $ressource->url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
        $ressource->project_id = $project->id;
        $ressource->save();

        $videoRessource = new Ressource();
        $videoRessource->name = 'Top 5 Freddy Fazbear';
        $videoRessource->type = 'video';
        $videoRessource->description = 'Top 5 Freddy Fazbear moments 🤯';
        $videoRessource->url = '/topfreddy.mp4';
        $videoRessource->project_id = $project->id;
        $videoRessource->save();

        $videowReview = new \App\Models\VideoReview();
        $videowReview->project_id = $project->id;
        $videowReview->ressource_id = $videoRessource->id;
        $videowReview->version = 1;
        $videowReview->type = 'video/mp4';
        $videowReview->resolution = '720';
        $videowReview->provider = 'html5';
        $videowReview->validated = false;
        $videowReview->save();

        $videowComment = new \App\Models\CommentReview();
        $videowComment->user_id = 1;
        $videowComment->message = '[[00:00:10]] - ahah the first one is so funny';
        $videowComment->video_review_id = $videowReview->id;
        $videowComment->save();


        // Project 6 -> Transcription 0 fichier Tout le rest Avant mais étape PostProd finit
        $project = \App\Models\Project::find(6);
        $project->steps = json_decode($project->steps);
        $project->steps->Planning->status = 'done';
        $project->steps->Capture->status = 'done';
        $project->steps->{'Post-Production'}->status = 'done';
        $project->steps->{'Transcription'}->status = 'ongoing';
        $project->steps = json_encode($project->steps);
        $project->save();

        $ressource = new Ressource();
        $ressource->name = 'Captation url';
        $ressource->type = 'Captation url';
        $ressource->description = 'Captation url';
        $ressource->url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
        $ressource->project_id = $project->id;
        $ressource->save();

        $videoRessource = new Ressource();
        $videoRessource->name = 'Top 5 Freddy Fazbear';
        $videoRessource->type = 'video';
        $videoRessource->description = 'Top 5 Freddy Fazbear moments 🤯';
        $videoRessource->url = '/topfreddy.mp4';
        $videoRessource->project_id = $project->id;
        $videoRessource->save();

        $videowReview = new \App\Models\VideoReview();
        $videowReview->project_id = $project->id;
        $videowReview->ressource_id = $videoRessource->id;
        $videowReview->version = 1;
        $videowReview->type = 'video/mp4';
        $videowReview->resolution = '720';
        $videowReview->provider = 'html5';
        $videowReview->validated = false;
        $videowReview->save();

        $videowComment = new \App\Models\CommentReview();
        $videowComment->user_id = 1;
        $videowComment->message = '[[00:00:10]] - ahah the first one is so funny';
        $videowComment->video_review_id = $videowReview->id;
        $videowComment->save();


        // Project 7 -> Transcription 1 fichier Tout le reste Avant + une transcription
        $project = \App\Models\Project::find(7);
        $project->steps = json_decode($project->steps);
        $project->steps->Planning->status = 'done';
        $project->steps->Capture->status = 'done';
        $project->steps->{'Post-Production'}->status = 'done';
        $project->steps->{'Transcription'}->status = 'ongoing';
        $project->steps = json_encode($project->steps);
        $project->save();

        $ressource = new Ressource();
        $ressource->name = 'Captation url';
        $ressource->type = 'Captation url';
        $ressource->description = 'Captation url';
        $ressource->url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
        $ressource->project_id = $project->id;
        $ressource->save();

        $videoRessource = new Ressource();
        $videoRessource->name = 'Top 5 Freddy Fazbear';
        $videoRessource->type = 'video';
        $videoRessource->description = 'Top 5 Freddy Fazbear moments 🤯';
        $videoRessource->url = '/topfreddy.mp4';
        $videoRessource->project_id = $project->id;
        $videoRessource->save();

        $videowReview = new \App\Models\VideoReview();
        $videowReview->project_id = $project->id;
        $videowReview->ressource_id = $videoRessource->id;
        $videowReview->version = 1;
        $videowReview->type = 'video/mp4';
        $videowReview->resolution = '720';
        $videowReview->provider = 'html5';
        $videowReview->validated = true;
        $videowReview->save();

        $videowComment = new \App\Models\CommentReview();
        $videowComment->user_id = 1;
        $videowComment->message = '[[00:00:10]] - ahah the first one is so funny';
        $videowComment->video_review_id = $videowReview->id;
        $videowComment->save();

        $transcriptionRessource = new Ressource();
        $transcriptionRessource->name = 'Transcription';
        $transcriptionRessource->type = 'transcription';
        $transcriptionRessource->description = 'Transcription';
        $transcriptionRessource->url = '/transcription.srt';
        $transcriptionRessource->project_id = $project->id;
        $transcriptionRessource->save();

        $transcriptionRessource2 = new Ressource();
        $transcriptionRessource2->name = 'Transcription';
        $transcriptionRessource2->type = 'transcription';
        $transcriptionRessource2->description = 'Transcription';
        $transcriptionRessource2->url = '/transcription.vtt';
        $transcriptionRessource2->project_id = $project->id;
        $transcriptionRessource2->save();

        $transcription = new \App\Models\Transcription();
        $transcription->project_id = $project->id;
        $transcription->version = 1;
        $transcription->ressource_id = $transcriptionRessource->id;
        $transcription->file_type = 'srt';
        $transcription->save();

        $transcription2 = new \App\Models\Transcription();
        $transcription2->project_id = $project->id;
        $transcription2->version = 1;
        $transcription2->ressource_id = $transcriptionRessource2->id;
        $transcription2->file_type = 'vtt';
        $transcription2->save();



        // Project 8 -> Transcription 1 fichier Tout le reste Avant + une transcription
        $project = \App\Models\Project::find(8);
        $project->steps = json_decode($project->steps);
        $project->steps->Planning->status = 'done';
        $project->steps->Capture->status = 'done';
        $project->steps->{'Post-Production'}->status = 'done';
        $project->steps->{'Transcription'}->status = 'done';
        $project->steps->{'Subtitling'}->status = 'ongoing';
        $project->steps = json_encode($project->steps);
        $project->save();

        $ressource = new Ressource();
        $ressource->name = 'Captation url';
        $ressource->type = 'Captation url';
        $ressource->description = 'Captation url';
        $ressource->url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
        $ressource->project_id = $project->id;
        $ressource->save();

        $videoRessource = new Ressource();
        $videoRessource->name = 'Top 5 Freddy Fazbear';
        $videoRessource->type = 'video';
        $videoRessource->description = 'Top 5 Freddy Fazbear moments 🤯';
        $videoRessource->url = '/topfreddy.mp4';
        $videoRessource->project_id = $project->id;
        $videoRessource->save();

        $videowReview = new \App\Models\VideoReview();
        $videowReview->project_id = $project->id;
        $videowReview->ressource_id = $videoRessource->id;
        $videowReview->version = 1;
        $videowReview->type = 'video/mp4';
        $videowReview->resolution = '720';
        $videowReview->provider = 'html5';
        $videowReview->validated = true;
        $videowReview->save();

        $videowComment = new \App\Models\CommentReview();
        $videowComment->user_id = 1;
        $videowComment->message = '[[00:00:10]] - ahah the first one is so funny';
        $videowComment->video_review_id = $videowReview->id;
        $videowComment->save();

        $transcriptionRessource = new Ressource();
        $transcriptionRessource->name = 'Transcription';
        $transcriptionRessource->type = 'transcription';
        $transcriptionRessource->description = 'Transcription';
        $transcriptionRessource->url = '/transcription.srt';
        $transcriptionRessource->project_id = $project->id;
        $transcriptionRessource->save();

        $transcriptionRessource2 = new Ressource();
        $transcriptionRessource2->name = 'Transcription';
        $transcriptionRessource2->type = 'transcription';
        $transcriptionRessource2->description = 'Transcription';
        $transcriptionRessource2->url = '/transcription.vtt';
        $transcriptionRessource2->project_id = $project->id;
        $transcriptionRessource2->save();

        $transcription = new \App\Models\Transcription();
        $transcription->project_id = $project->id;
        $transcription->version = 1;
        $transcription->ressource_id = $transcriptionRessource->id;
        $transcription->file_type = 'srt';
        $transcription->is_valid = 1;
        $transcription->save();

        $transcription2 = new \App\Models\Transcription();
        $transcription2->project_id = $project->id;
        $transcription2->version = 1;
        $transcription2->ressource_id = $transcriptionRessource2->id;
        $transcription2->file_type = 'vtt';
        $transcription2->is_valid = 1;
        $transcription2->save();

        $voSubtitle = new \App\Models\Subtitle();
        $voSubtitle ->project_id = $project->id;
        $voSubtitle ->ressource_id = $transcriptionRessource->id;
        $voSubtitle ->file_type = 'vtt';
        $voSubtitle ->lang = 'vo';
        $voSubtitle->save();

        $voSubtitle2 = new \App\Models\Subtitle();
        $voSubtitle2 ->project_id = $project->id;
        $voSubtitle2 ->ressource_id = $transcriptionRessource2->id;
        $voSubtitle2 ->file_type = 'srt';
        $voSubtitle2 ->lang = 'vo';
        $voSubtitle2->save();


    }
}
