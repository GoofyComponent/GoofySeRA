<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;


class ProjectRequestFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = \App\Models\ProjectRequest::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Récupère un user avec le role cursus_director au pif
        $cursus_director = \App\Models\User::where('role', 'cursus_director')->inRandomOrder()->first();

        // Dans le retour, tu mets les champs que tu veux remplir
        return [
            'user_id' => $cursus_director->id,
            'priority' => $this->faker->numberBetween(1, 3),
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(3),
            'needs' => $this->faker->paragraph(3),
            'status' => $this->faker->randomElement(['pending', 'accepted', 'refused']),
        ];
    }

}
