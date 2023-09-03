<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VideoReview extends Model
{
    use HasFactory;

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function ressource()
    {
        return $this->belongsTo(Ressource::class);
    }

    public function comments()
    {
        return $this->hasMany(CommentReview::class);
    }
}
