<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Edito extends Model
{
    use HasFactory;

    public function project()
    {
        return $this->hasOne(Project::class);
    }
}
