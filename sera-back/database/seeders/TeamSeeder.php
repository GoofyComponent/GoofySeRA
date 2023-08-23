<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class TeamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // on récupère tous les projets
        $projects = \App\Models\Project::all();

        // si aucun projet n'existe, on en crée 3
        if ($projects->count() === 0) {
            $projects = \App\Models\Project::factory()->count(3)->create();
        }
        foreach ($projects as $project) {
            $teams[] = \App\Models\Team::factory()->create([
                'project_id' => $project->id,
            ]);
        }
        // On va créer pour chacune des équipes créées un membre de chaque type
        $roles = array_keys(config('roles'));

        foreach ($teams as $team) {
            foreach ($roles as $role) {
                $user = User::where('role', $role)->first();
                if ($user === null) {
                    $user = User::factory()->create([
                        'role' => $role,
                    ]);
                }

                \App\Models\UserTeam::factory()->create([
                    'user_id' => $user->id,
                    'team_id' => $team->id,
                ]);
            }
        }


        // on récupère le premier projet et on va lui ajouter un membre de chaque type
        $project = \App\Models\Project::find(1);
        foreach ($roles as $role) {
            $user = User::where('role', $role)->first();
            if ($user === null) {
                $user = User::factory()->create([
                    'role' => $role,
                ]);
            }

            // on regarde si un team existe déjà pour ce projet
            $team = \App\Models\Team::where('project_id', $project->id)->first();

            if ($team === null) {
                $team = \App\Models\Team::factory()->create([
                    'project_id' => $project->id,
                ]);
            }
            //  hasUser
            if (!$team->hasUser($user->id)) {
                $team->addUser($user->id, $team->id);
            }
        }

    }
}
