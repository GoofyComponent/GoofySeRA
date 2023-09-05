<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'project_request_id',
        'title',
        'description',
        'start_date',
        'end_date',
        'status',
        'colors'
    ];

    public function projectRequest()
    {
        return $this->belongsTo(ProjectRequest::class);
    }

    public function team()
    {
        return $this->hasOne(Team::class);
    }

    public function reservations()
    {
        return $this->hasMany(RoomReservation::class);
    }

    public function videoReviews()
    {
        return $this->hasOne(VideoReview::class);
    }

    public function ressources()
    {
        return $this->hasMany(Ressource::class);
    }

    public function transcriptions()
    {
        return $this->hasMany(Transcription::class);
    }
}
