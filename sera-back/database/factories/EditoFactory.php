<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Edito>
 */
class EditoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        // toutes mes images vont être /template.jpeg. Il faut en mettre max 5 et au minimum 0
        $images = [];
        for ($i = 0; $i < rand(0, 5); $i++) {
            $images[] = '/template.jpeg';
        }
        return [
            'title' => $this->faker->realText(20),
            'description' => $this->faker->realText(500),
            'images' => json_encode($images),
        ];
    }
}
