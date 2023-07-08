<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use HasFactory;

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function users()
    {
        return $this->hasManyThrough(User::class, UserTeam::class, 'team_id', 'id', 'id', 'user_id');
    }

    public function addUser($userId, $teamId)
    {
        $userTeam = new UserTeam();
        $userTeam->user_id = $userId;
        $userTeam->team_id = $teamId;
        $userTeam->save();
    }

    public function removeUser($userId)
    {
        $userTeam = UserTeam::where('user_id', $userId)->where('team_id', $this->id)->first();
        $userTeam->delete();
    }

    public function hasUser($userId)
    {
        return UserTeam::where('user_id', $userId)->where('team_id', $this->id)->exists();
    }
}
