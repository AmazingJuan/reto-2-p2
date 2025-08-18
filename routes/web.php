<?php

use App\Http\Controllers\ServicesController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', 'App\Http\Controllers\ServicesController@index')->name('home');


Route::get('/servicios', function () {
    return Inertia::render('Servicios'); // aquí el nombre del componente TSX
});