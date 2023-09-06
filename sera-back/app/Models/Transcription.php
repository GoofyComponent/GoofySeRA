<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transcription extends Model
{
    use HasFactory;

    protected $fillable = [
        'ressource_id',
        'project_id',
        'version',
        'file_type',
    ];

    public function ressource()
    {
        return $this->belongsTo(Ressource::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
