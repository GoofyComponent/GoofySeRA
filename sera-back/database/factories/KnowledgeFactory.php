<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Knowledge>
 */
class KnowledgeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->realText(20),
            'type' => $this->faker->randomElement(config('knowledge-type')),
            'infos' => $this->faker->realText(200),
            'image' => $this->faker->boolean() ? '/template.jpeg' : null,
        ];
    }
}
