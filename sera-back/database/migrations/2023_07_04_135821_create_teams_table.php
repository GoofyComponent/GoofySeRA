<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        /*example of one role column :
            video_team = [0,3,8] ou le numéro correspond à l'id de l'utilisateur
        */
        Schema::create('teams', function (Blueprint $table) {
            $roles = array_keys(config('roles'));
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete()->cascadeOnUpdate();
            foreach ($roles as $role) {
                $table->json($role)->nullable();
            }
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teams');
    }
};
