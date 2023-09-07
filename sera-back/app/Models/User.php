<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Storage;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Contracts\Filesystem\FilesystemManager;


class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'email',
        'password',
        'firstname',
        'lastname',
        'role',
        'file',
        's3_credentials',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        's3_credentials',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function projectRequests()
    {
        return $this->hasMany(ProjectRequest::class);
    }

    public function teams()
    {
        return $this->hasManyThrough(Team::class, UserTeam::class, 'user_id', 'id', 'id', 'team_id');
    }

    public function projects()
    {
        return $this->teams()->get()->map(function ($team) {
            return $team->project;
        });
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function getAvatarFilenameAttribute($value)
    {

        // if value is null, return default avatar
        if (!$value) {
            return null;
        }

        if (app()->environment('local')) {
            $config = config('filesystems.disks.s3');
            $config['url'] = 'http://localhost:9000';
            $config['endpoint'] = 'http://localhost:9000';
            config(['filesystems.disks.s3' => $config]);
        }
        $disk = Storage::disk('s3');
        $temporaryUrl = $disk->temporaryUrl(
            $value,
            now()->addHours(24),
        );

        return $temporaryUrl;
    }
}
