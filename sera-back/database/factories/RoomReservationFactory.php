<?php

namespace Database\Factories;

use App\Models\ProjectRequest;
use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class RoomReservationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition (): array
    {
        return [
            'room_id' => $this->faker->numberBetween(1, 10),
            'project_id' => $this->faker->numberBetween(1, 10),
            'date' => $this->faker->dateTimeBetween('now', '+1 years'),
            'start_time' => $this->faker->dateTimeBetween('now', '+1 years'),
            'end_time' => $this->faker->dateTimeBetween('now', '+1 years'),
            'title' => $this->faker->sentence(3),
            'created_at' => $this->faker->dateTimeBetween('now', '+1 years'),
            'updated_at' => $this->faker->dateTimeBetween('now', '+1 years'),
        ];
    }
}
