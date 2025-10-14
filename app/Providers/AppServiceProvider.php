<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (app()->environment('local')) {
            $user = User::firstOrCreate(
                ['email' => 'test@example.com'],
                [
                    'name' => 'Usuario de Prueba',
                    'password' => bcrypt('password'),
                ]
            );
            Auth::login($user);
        }
    }
}
