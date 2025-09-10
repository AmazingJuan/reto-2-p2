<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('condition_service_type', function (Blueprint $table) {
            $table->id();
            $table->foreignId('condition_id')->constrained()->onDelete('cascade');
            $table->string('service_type_id'); // string, porque tu PK es string
            $table->foreign('service_type_id')->references('id')->on('service_types')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('condition_service_type');
    }
};
