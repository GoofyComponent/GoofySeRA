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
        $projects = \App\Models\Project::factory()->count(3)->create();
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
                    'role' => $role,
                    'user_id' => $user->id,
                    'team_id' => $team->id,
                ]);
            }
        }
    }
}
