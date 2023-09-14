<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Edito extends Model
{
    use HasFactory;

    public function project()
    {
        return $this->hasOne(Project::class);
    }

    public function knowledges()
    {
        return $this->belongsToMany(Knowledge::class, 'edito_knowledge', 'edito_id', 'knowledge_id');
    }

    public function getimagesAttribute($value)
    {
        // si value null, return null
        if (!$value) {
            return null;
        }

        if (env('IS_LOCAL')) {
            $config = config('filesystems.disks.s3');
            $config['url'] = 'http://localhost:9000';
            $config['endpoint'] = 'http://localhost:9000';
            config(['filesystems.disks.s3' => $config]);
        }

        $disk = Storage::disk('s3');

        $value =  array_values((array) json_decode($value));
        $temporaryUrl = [];

        foreach ($value as $key => $image) {
            $temporaryUrl[$key] = $disk->temporaryUrl(
                $image,
                now()->addHours(24)
            );
        }

        return json_encode($temporaryUrl);
    }
}
