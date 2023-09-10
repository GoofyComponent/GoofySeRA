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
        $cursus_director = \App\Models\User::where('role', 'cursus_director')->inRandomOrder()->first();
        $priorityArray = ["low", "medium", "high"];
        $statusArray = ["pending", "accepted", "refused"];
        return [
            'user_id' => $cursus_director->id,
            'priority' => $this->faker->randomElement($priorityArray),
            'title' => $this->faker->realText(20),
            'description' => $this->faker->realText(100),
            'needs' => $this->faker->realText(100),
            'status' => $this->faker->randomElement($statusArray),
        ];
    }

}
