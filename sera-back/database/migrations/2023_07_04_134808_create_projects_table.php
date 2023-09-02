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



        Schema::create('projects', function (Blueprint $table) {
            $defaultSteps = config('steps');

            $table->id();
            $table->foreignId('project_request_id')->constrained('project_requests')->cascadeOnDelete()->cascadeOnUpdate();
            $table->string('title');
            $table->longText('description');
            $table->enum('status', ['ongoing', 'completed', 'cancelled'])->default('ongoing');
            $table->string('start_date')->nullable();
            $table->string('end_date')->nullable();
            $table->json('colors')->nullable();
            $table->json('steps')->default(json_encode($defaultSteps));
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
