<?php

namespace Database\Factories;

use App\Models\GestionLine;
use App\Models\ServiceType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class ServiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Only use valid seeded service_type_id values

        $serviceTypes = ServiceType::all();
        $gestionLines = GestionLine::all();

        return [
            'name' => $this->faker->unique()->word,
            'description' => $this->faker->sentence,
            'service_type_id' => $this->faker->randomElement($serviceTypes)->id,
            'gestion_line_id' => $this->faker->randomElement($gestionLines)->id,
        ];
    }
}
