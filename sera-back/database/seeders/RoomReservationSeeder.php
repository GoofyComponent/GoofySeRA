<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Carbon\Carbon;

class RoomReservationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $reservations = \App\Models\RoomReservation::factory()->count(10)->make();

        foreach ($reservations as $reservation) {
            do {
                if ($reservation->id != 1){
                    $lastReservation = \App\Models\RoomReservation::find($reservation->id - 1);
                }
                $overlap = true;
                // if the time of the reservation is overlapping with the last reservation, create a new one
                if (isset($lastReservation) && $lastReservation->room_id == $reservation->room_id && $lastReservation->date == $reservation->date) {
                    $start_time = Carbon::instance($lastReservation->start_time)->addHour(1);
                    $end_time = Carbon::instance($start_time)->addHours(rand(1, 4));
                    $reservation->start_time = $start_time->format('H:i');
                    $reservation->end_time = $end_time->format('H:i');
                } else {
                    $overlap = false;
                }
            } while ($overlap == true || $reservation->id == 1);
            $reservation->save();
        }
    }
}
