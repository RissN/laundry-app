<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!auth()->check()) {
            return redirect('login');
        }

        $userLevel = (string) auth()->user()->id_level;

        if (in_array($userLevel, $roles)) {
            return $next($request);
        }

        // Admin (1) can access Operator (2) features
        if ($userLevel === '1' && in_array('2', $roles)) {
            return $next($request);
        }

        abort(403, 'Unauthorized action.');
    }
}
