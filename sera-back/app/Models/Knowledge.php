<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Knowledge extends Model
{
    use HasFactory;

    public function getimageAttribute($value)
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

        $temporaryUrl = $disk->temporaryUrl(
            $value,
            now()->addHours(24)
        );

        return $temporaryUrl;
    }
}
