<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ressource>
 */
class RessourceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // on récupère un projet au hasard et on lui associe une ressource
        $project = \App\Models\Project::inRandomOrder()->first();
        if ($project === null) {
            $project = \App\Models\Project::factory()->create();
        }

        $types = [];

        return [
            "project_id" => $project->id,
            "name" => $this->faker->sentence(3),
            "type" => $types[array_rand($types)],
            "url" => "/storage/images/lulu.jpg",
            "description" => $this->faker->sentence(10),
        ];
    }
}
