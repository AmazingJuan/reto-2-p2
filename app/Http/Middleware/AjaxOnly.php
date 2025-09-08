<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AjaxOnly
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->ajax()) {
            abort(403, 'Acceso no permitido');
        }
        return $next($request);
    }
}
