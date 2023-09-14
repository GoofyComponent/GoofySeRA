<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\ApiKey;

class ApiCheck
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        // si l'appel est fait en local, on ne vérifie pas le token
        if (env('APP_ENV') === 'local') {
            return $next($request);
        }

        // on récupère le token appelé "api_token" dans le header de la requête
        $token = $request->header('api_token');
        // on vérifie que le token existe
        if (!$token) {
            // si le token n'existe pas, on retourne une erreur 401
            return response()->json(['error' => 'Unauthorized, no token provided'], 401);
        }
        // on vérifie que le token existe dans la table api_keys
        $apiKey = ApiKey::where('key', $token)->first();

        if (!$apiKey) {
            // si le token n'existe pas, on retourne une erreur 401
            return response()->json(['error' => 'Unauthorized, invalid token'], 401);
        }

        return $next($request);
    }
}
