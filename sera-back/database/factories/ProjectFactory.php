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
        $statusArray = ["ongoing", "completed", "cancelled"];
        $defaultSteps = config('steps');
        $projectRequest = ProjectRequest::factory()->create();

        return [
            'project_request_id' => $projectRequest->id,
            'title' => $this->faker->realText(20),
            'description' => $this->faker->realText(100),
            'status' => "ongoing",
            'start_date' => Carbon::now()->addDays(1)->format('Y-m-d'),
            'end_date' => Carbon::now()->addDays(2)->format('Y-m-d'),
            'colors' => json_encode(ColorHelper::prettyHexadecimal(150)),
            'steps' => json_encode($defaultSteps),
        ];
    }
}
