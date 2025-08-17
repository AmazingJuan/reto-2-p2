<?php

use App\Http\Controllers\ServicesController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', 'App\Http\Controllers\ServicesController@index')->name('home');