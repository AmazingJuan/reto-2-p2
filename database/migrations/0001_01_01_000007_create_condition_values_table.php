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

            // condition_id = referencia a conditions.id (auto increment -> bigint) => foreignId funciona
            $table->foreignId('condition_id')
                ->constrained('conditions')
                ->onDelete('cascade');

            // service_type_id = string, coincide con service_types.id
            $table->string('service_type_id')->nullable();
            $table->foreign('service_type_id')
                ->references('id')
                ->on('service_types')
                ->onDelete('set null');

            // next_condition_id = bigint, coincide con conditions.id
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
