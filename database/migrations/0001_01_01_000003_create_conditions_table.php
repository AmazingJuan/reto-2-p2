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
        Schema::create('conditions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type')->default('text');
            $table->text('description')->nullable();
            $table->foreignId('next_condition_id')
                ->nullable()
                ->constrained('conditions')
                ->onDelete('set null');
            $table->boolean('is_fixed')->default(true);
            $table->boolean('allows_other_values')->default(false);
            $table->boolean('allows_multiple_values')->default(false);
            $table->boolean('is_boolean')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conditions');
    }
};
