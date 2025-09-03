<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Condition;
use Illuminate\Database\Seeder;

class ConditionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Condition::create([
            'name' => 'Viaticos',
        ]);

        Condition::create([
            'name' => 'Viaticos',
        ]);
    }
}
