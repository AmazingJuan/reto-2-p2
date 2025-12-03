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
        Schema::create('quotation_orders', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('business_unit_id')->constrained();
            $table->foreignId('gestion_line_id')
                ->nullable()
                ->constrained()
                ->onDelete('set null');
            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');
            $table->boolean('is_generated')->default(false);
            $table->json('services');
            $table->json('options');
            $table->string('quotation_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quotation_orders');
    }
};
