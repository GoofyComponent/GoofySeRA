<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Team>
 */
class TeamFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $project = \App\Models\Project::factory()->create();

        $users = [];
        // Create one user for each role in the roles config file
        foreach (config('roles') as $role => $value) {
            // if email already exists, skip
            if (\App\Models\User::where('email', $role . '@seraSeeder.com')->first()) {
                $users[$role] = \App\Models\User::where('email', $role . '@sera.com')->first()->id;
                continue;
            }

            $users[$role] = \App\Models\User::factory()->create([
                'lastname' => $role,
                'email' => $role . '@seraSeeder.com',
                'password' => bcrypt('password'),
                'role' => $role
            ])->id;


        }
        return [
            'project_id' => $project->id,
            'cursus_director' => json_encode([$users['cursus_director']]),
            'project_manager' => json_encode([$users['project_manager']]),
            'professor' => json_encode([$users['professor']]),
            'video_team' => json_encode([$users['video_team']]),
            'video_editor' => json_encode([$users['video_editor']]),
            'transcription_team' => json_encode([$users['transcription_team']]),
            'traduction_team' => json_encode([$users['traduction_team']]),
            'editorial_team' => json_encode([$users['editorial_team']]),
        ];
    }
}
