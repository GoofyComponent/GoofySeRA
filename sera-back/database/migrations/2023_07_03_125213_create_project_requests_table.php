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
        Schema::create('project_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete()->cascadeOnUpdate();
            $table->tinyInteger('priority')->default(1);
            $table->string('title', 100)->nullable(false)->default('New Project Request');
            $table->text('description')->nullable(false)->default('Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.');
            $table->text('needs')->nullable(false)->default('Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project__requests');
    }
};
