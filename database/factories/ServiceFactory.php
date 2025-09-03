<?php

namespace Database\Factories;

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
        $validServiceTypeIds = ['auditoria', 'consultoria', 'formacion'];
        return [
            'name' => $this->faker->unique()->word,
            'description' => $this->faker->sentence,
            'service_type_id' => $this->faker->randomElement($validServiceTypeIds),
            'gestion_line' => $this->faker->word,
            'created_at' => now(),
        ];
    }
}
