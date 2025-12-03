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
        Schema::create('condition_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('condition_id')
                ->constrained()
                ->onDelete('cascade');
            $table->foreignId('business_unit_id')->constrained();
            $table->foreignId('next_condition_id')
                ->nullable()
                ->constrained('conditions')
                ->onDelete('set null');
            $table->string('value', 100);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('condition_values');
    }
};
