<?php

namespace Database\Factories;

use Illuminate\Support\Str;
use App\Services\CreateMinioUser;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Crypt;



/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $roles = array_keys(config('roles'));
        $s3_credentials = (new CreateMinioUser())->create();
        // hash secret
        $s3_credentials['secretkey'] = Crypt::encrypt($s3_credentials['secretkey']);
        $s3_credentials['accesskey'] = Crypt::encrypt($s3_credentials['accesskey']);
        return [
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'remember_token' => Str::random(10),
            'firstname' => fake()->firstName(),
            'lastname' => fake()->lastName(),
            'role' => $roles[array_rand($roles)],
            'avatar_filename' => fake()->boolean(50) ? 'lulu' : null,
            's3_credentials' => json_encode($s3_credentials),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}

?>
