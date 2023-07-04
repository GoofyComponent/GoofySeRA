<?php

namespace App\Helpers;

use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleHelper
{
    public static function checkRoleAccess(Request $request)
    {
        if (!$request->user()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $roles = config('roles');
        $routeName = $request->route()->getName();
        list($resource, $action) = explode(".", $routeName);

        $userRole = $request->user()->role;

        if (!isset($roles[$userRole][$resource]) || !in_array($action, $roles[$userRole][$resource])) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return null;
    }
}

