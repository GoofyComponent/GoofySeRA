<?php

namespace Database\Seeders;

use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use App\Services\CreateMinioUser;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserProdSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        // on search si l'utilisateur existe déjà
        if (\App\Models\User::where('email', 'admin@sera.com')->exists()) {
            return;
        }

        $s3_credentials = (new CreateMinioUser())->create();
        $s3_credentials['secretkey'] = Crypt::encrypt($s3_credentials['secretkey']);
        $s3_credentials['accesskey'] = Crypt::encrypt($s3_credentials['accesskey']);

        // adapted for production and use only model and not factory
        $user = \App\Models\User::firstOrCreate([
            'email' => 'admin@sera.com',
            'email_verified_at' => now(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'remember_token' => Str::random(10),
            'firstname' => 'Admin',
            'lastname' => 'Istrator',
            'role' => 'cursus_director',
            'avatar_filename' => 'lulu',
            's3_credentials' => json_encode($s3_credentials),
        ]);

    }
}
