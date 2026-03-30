<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Garantiza una única fila en configurations (puede tener campos vacíos).
     */
    public function up(): void
    {
        if (DB::table('configurations')->count() > 0) {
            return;
        }

        DB::table('configurations')->insert([
            'notification_email' => null,
            'application_url' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        // No eliminar datos: la fila puede haberse editado.
    }
};
