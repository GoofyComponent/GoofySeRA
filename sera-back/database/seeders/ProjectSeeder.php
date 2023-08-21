<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Carbon\Carbon;
class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Project::factory()->count(15)->create();

        // on prend le premier projet avec l'id 1
        $project = \App\Models\Project::find(1);


        $i = 0;
        $project->steps = json_decode($project->steps);
        foreach ($project->steps as $step => $value) {
            if ($step == 'Capture') {
                $value->start_date = Carbon::create(2023, 1, 8, 14, 0, 0)->format('Y-m-d H:i:s');
                $value->end_date =  Carbon::create(2023, 1, 8, 14, 0, 0)->format('Y-m-d H:i:s');
            } else {
                // on créer mais sans l'heure
                $value->start_date = Carbon::create(2023, 1, 8+ $i)->format('Y-m-d');
                $value->end_date =  Carbon::create(2023, 1, 8+ $i)->format('Y-m-d');
            }
            $i++;
        }
        // en json pour pouvoir le mettre dans la bdd
        $project->steps = json_encode($project->steps);
        $project->save();



       // On crée un un projet et on va mettre steps->Planning[status] = ongoing
        $project = \App\Models\Project::find(2);
        $project->steps = json_decode($project->steps);
        $project->steps->Planning->status = 'done';
        $project->steps->Capture->status = 'ongoing';
        $project->steps = json_encode($project->steps);
        $project->save();
    }
}
