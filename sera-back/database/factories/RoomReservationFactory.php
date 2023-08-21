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
    public function definition(): array
    {
        $rooms = \App\Models\Room::all()->pluck('id')->toArray();
        if (empty($rooms)) {
            \App\Models\Room::factory()->count(10)->create();
        }

        $projects = \App\Models\Project::all()->pluck('id')->toArray();
        if (empty($projects)) {
            \App\Models\Project::factory()->count(10)->create();
        }

        $date = $this->faker->dateTimeBetween('now', '+1 years');
        // Start time is between 8:00 and 18:00
        $start_time = Carbon::instance($date)->setTime($this->faker->numberBetween(8, 18), 0, 0);
        // End time is between 1 and 4 hours after start time
        $end_time = Carbon::instance($start_time)->addHours($this->faker->numberBetween(1, 4));


        // on récupère un user avec le role de professor, un autre avec le role video_team
        $professor = \App\Models\User::where('role', 'professor')->first();
        if (empty($professor)) {
            $professor = \App\Models\User::factory()->create(['role' => 'professor']);
        }

        $video_team = \App\Models\User::where('role', 'video_team')->first();
        if (empty($video_team)) {
            $video_team = \App\Models\User::factory()->create(['role' => 'video_team']);
        }

        $users = [
             [
                'firstname' => $professor->firstname,
                'lastname' => $professor->lastname,
                'role' => $professor->role,
                'id' => $professor->id,
            ],
            [
                'firstname' => $video_team->firstname,
                'lastname' => $video_team->lastname,
                'role' => $video_team->role,
                'id' => $video_team->id,
            ],
        ];

        return [
            'room_id' => $this->faker->randomElement($rooms),
            'project_id' => $this->faker->randomElement($projects),
            'date' => $date,
            'start_time' => $start_time->format('H:i'),
            'end_time' => $end_time->format('H:i'),
            'title' => $this->faker->sentence(3),
            'users' => json_encode($users),
        ];
    }

}
