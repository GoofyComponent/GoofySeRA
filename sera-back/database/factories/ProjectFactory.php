<?php

namespace Database\Factories;

use App\Models\ProjectRequest;
use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Helpers\ColorHelper;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $getColor = ColorHelper::prettyHexadecimal(150);
        $statusArray = ["ongoing","completed","cancelled"];
        $projectRequest = ProjectRequest::factory()->create();
        return [
            'project_request_id' => $projectRequest->id,
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(3),
            'status' => $this->faker->randomElement($statusArray),
            'start_date' => Carbon::now()->addDays(1)->format('Y-m-d'),
            'end_date' => Carbon::now()->addDays(2)->format('Y-m-d'),
            'color' => $getColor[0],
            'color_2'=> $getColor[1],
        ];
    }
}