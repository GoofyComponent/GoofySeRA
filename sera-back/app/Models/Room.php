<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;


class Room extends Model
{
    use HasFactory;

    /**
     * Get the reservations for the room.
     */
    public function reservations()
    {
        return $this->hasMany(RoomReservation::class);
    }

    public function canBeReserved($date, $startTime, $endTime)
    {
        $reservations = $this->reservations()->where('date', $date)->get();

        $startTime = Carbon::parse($date . ' ' . $startTime);
        $endTime = Carbon::parse($date . ' ' . $endTime);

        foreach ($reservations as $reservation) {
            $reservationStartTime = Carbon::parse($reservation->date . ' ' . $reservation->start_time);
            $reservationEndTime = Carbon::parse($reservation->date . ' ' . $reservation->end_time);

            if ($startTime->between($reservationStartTime, $reservationEndTime)
                || $endTime->between($reservationStartTime, $reservationEndTime)
                || $reservationStartTime->between($startTime, $endTime)
                || $reservationEndTime->between($startTime, $endTime)
            ) {
                return false;
            }
        }

        return true;
    }

    public function reserve($date, $startTime, $endTime, $title, $projectId)
    {
        $reservation = new RoomReservation();

        if (!$this->canBeReserved($date, $startTime, $endTime)) {
            return false;
        }

        if ($this->id === null) {
            dd('Room not found into reserve.');
            return false;
        }

        $reservation->room_id = $this->id;
        $reservation->project_id = $projectId;
        $reservation->date = $date;
        $reservation->start_time = $startTime;
        $reservation->end_time = $endTime;
        $reservation->title = $title;

        $reservation->save();

        return $reservation;
    }

}
