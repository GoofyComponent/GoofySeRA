<?php

namespace App\Models;

use Carbon\Carbon;
use Carbon\CarbonInterval;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Model;
use App\Http\Controllers\UserController;
use Illuminate\Database\Eloquent\Factories\HasFactory;


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

    public function canBeReserved($date, $startTime, $endTime, $projectId)
    {
        $project = Project::find($projectId);
        if ($project === null) {
            return false;
        }

        // il faut que la step planification soit ongoing
        $steps = json_decode($project->steps);
        if ($steps->Planning->status !== 'ongoing') {
            return false;
        }


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

    public function reserve($date, $startTime, $endTime, $title, $projectId, $usersIds)
    {
        $reservation = new RoomReservation();

        if (!$this->canBeReserved($date, $startTime, $endTime,$projectId)) {
            return false;
        }

        if ($this->id === null) {
            return false;
        }

        $reservation->room_id = $this->id;
        $reservation->project_id = $projectId;
        $reservation->date = $date;
        $reservation->start_time = $startTime;
        $reservation->end_time = $endTime;
        $reservation->title = $title;

        $users = [];

        $userController = new UserController();
        $request = new Request();
        foreach ($usersIds as $userId) {

            $request->query->add(['user_id' => $userId]);

            $reservations = $userController->getReservations($request)->getOriginalContent();
            $startTime = Carbon::parse($startTime);
            $endTime = Carbon::parse($endTime);


            foreach ($reservations as $reservationProject) {

                $dateReserv = Carbon::parse($reservationProject['date']);
                $startTimeReserv = Carbon::parse($reservationProject['start_time']);
                $endTimeReserv = Carbon::parse($reservationProject['end_time']);

                // si la réservation est le même jour on verifie que les horaires ne se chevauchent pas
                if ($dateReserv->isSameDay($date)) {
                    if ($startTimeReserv->between($startTime, $endTime)
                        || $endTimeReserv->between($startTime, $endTime)
                        || $startTime->between($startTimeReserv, $endTimeReserv)
                        || $endTime->between($startTimeReserv, $endTimeReserv)
                    ) {
                        return [
                            'error' => "Un des utilisateurs n'est pas disponible",
                            'user' => User::find($userId),
                            'date' => $dateReserv,
                            'start_time' => $startTimeReserv,
                            'end_time' => $endTimeReserv,
                        ];
                    }
                }

            }
            $user = User::find($userId);
            if ($user !== null) {
                $users[] = [
                    'firstname' => $user->firstname,
                    'lastname' => $user->lastname,
                    'role' => $user->role,
                    'id' => $user->id,
                ];
            }

        }

        $reservation->users = json_encode($users);

        $reservation->save();

        return $reservation;
    }

}
