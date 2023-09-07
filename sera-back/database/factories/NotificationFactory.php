<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Notification>
 */
class NotificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "title" => $this->faker->realText(50),
            "description" => $this->faker->realText(200),
            "is_read" => $this->faker->boolean(),
            "is_urgent" => $this->faker->boolean(),
        ];
    }
}
