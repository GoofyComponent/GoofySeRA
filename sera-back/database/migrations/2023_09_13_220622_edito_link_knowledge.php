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
        Schema::table('edito_links_knowledge', function (Blueprint $table) {
            $table->id();
            $table->ForeignId('knowledge_id')->constrained('knowledges')->onDelete('cascade');
            $table->ForeignId('edito_id')->constrained('edito')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('edito_links_knowledge');
    }
};
