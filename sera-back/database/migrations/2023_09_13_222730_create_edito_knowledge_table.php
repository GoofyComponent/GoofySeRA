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
        Schema::create('edito_knowledge', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('knowledge_id');
            $table->unsignedBigInteger('edito_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('edito_knowledge');
    }
};
