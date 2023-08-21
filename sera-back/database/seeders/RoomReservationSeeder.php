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
        $dates = [];
        for($i = 0; $i < 5; $i++) {
            $dates[] = Carbon::now()->addDays($i+3)->format('Y-m-d');
        }

        foreach ($reservations as $reservation) {
            $reservation->date = $dates[array_rand($dates)];
        }


        $reservations = $reservations->groupBy('room_id')->map(function ($item) {
            return $item->groupBy('date')->map(function ($item) {
                if ($item->count() > 1) {
                    // En fonction du nombre $item->count() on crée autant d'intervalle de temps avec comme contrainte que les intervalles ne se chevauchent pas
                    // Par exemple [8h-10h] et [9h-11h] ne sont pas possible mais [8h-10h] et [10h-12h] le sont
                    for($i = 0; $i < $item->count(); $i++) {
                        $item[$i]->start_time = Carbon::createFromFormat('H:i:s', '08:00:00')->addHours($i*2)->format('H:i:s');
                        $item[$i]->end_time = Carbon::createFromFormat('H:i:s', '10:00:00')->addHours($i*2)->format('H:i:s');
                    }
                }
                return $item;
            });
        })->flatten(2);

        foreach ($reservations as $reservation) {
            $reservation->save();
        }
    }
}
