<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Carbon\Carbon;
use Faker\Factory as FakerFactory;

class RoomReservationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $reservations = \App\Models\RoomReservation::factory()->count(10)->make();
        $faker = FakerFactory::create();
        $date = $faker->dateTimeBetween('now', '+1 years');

        foreach ($reservations as $reservation) {
            do {
                $reservation->date = $date;
                $reservation->start_time = Carbon::instance($date)->setTime($faker->numberBetween(8, 18), 0, 0);
                $reservation->end_time = Carbon::instance($reservation->start_time)->addHours(rand(1, 4));
            } while (\App\Models\RoomReservation::where('room_id', $reservation->room_id)
                ->where('date', $reservation->date)
                ->where('start_time', '<=', $reservation->start_time)
                ->where('end_time', '>=', $reservation->end_time)
                ->exists());
        }

        foreach ($reservations as $reservation) {
            $reservation->save();
        }
    }
}
