<?php

use Illuminate\Support\Facades\Route;

Route::get('/portafolio', 'App\Http\Controllers\ServicesController@index')->name('services.index');

Route::get('/portafolio/{type}', 'App\Http\Controllers\ServicesController@show')->name('services.show');
