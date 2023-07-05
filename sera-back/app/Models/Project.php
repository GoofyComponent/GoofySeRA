<?php

namespace App\Models;

use App\Models\Project_Request as ModelsProject_Request;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project_Request extends Model
{
    use HasFactory;

    public function user()
    {
        return $this->belongsTo(Project_Request::class);
    }
}
