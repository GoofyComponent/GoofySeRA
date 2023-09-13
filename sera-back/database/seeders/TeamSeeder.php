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

        foreach ($projects as $project) {
            $teams[] = \App\Models\Team::factory()->create([
                'project_id' => $project->id,
            ]);
        }
        //  On va créer pour chacune des équipes créées un membre de chaque type
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
    }


}
