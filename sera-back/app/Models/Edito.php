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

    public function knowledges()
    {
        return $this->belongsToMany(Knowledge::class, 'edito_links_knowledge', 'edito_id', 'knowledge_id');
    }
}
