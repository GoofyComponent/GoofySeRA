<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoomReservation extends Model
{
    use HasFactory;

    /**
     * Get the room that owns the reservation.
     */
    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    /**
     * Get the project that owns the reservation.
     */
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

}
