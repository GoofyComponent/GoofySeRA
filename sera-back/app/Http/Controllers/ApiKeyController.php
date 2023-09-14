<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\ApiKey;

class ApiKeyController extends Controller
{

    /**
    * @OA\Post(
    *       path="/api/api-keys",
    *       tags={"API Key"},
    *       summary="Create an API key",
    *       description="Create an API key",
    *       @OA\RequestBody(
    *           required=true,
    *           @OA\JsonContent(
    *               required={"name","expires_at","never_expires"},
    *           @OA\Property(property="name", type="string", example="My API key"),
    *           @OA\Property(property="description", type="string", example="My API key description"),
    *           @OA\Property(property="expires_at", type="string", format="date-time", example="2021-09-14T21:34:35.000000Z"),
    *           @OA\Property(property="never_expires", type="boolean", example="false"),
    *           )
    *       ),
    *       @OA\Response(
    *           response=201,
    *           description="API key created successfully",
    *           @OA\JsonContent(
    *               @OA\Property(property="message", type="string", example="API key created successfully"),
    *           )
    *       ),
    *       @OA\Response(
    *           response=400,
    *           description="Validation error",
    *           @OA\JsonContent(
    *               @OA\Property(property="message", type="string", example="The given data was invalid."),
    *               @OA\Property(property="errors", type="object", example={"name": {"The name field is required."}}),
    *           )
    *       ),
    *       @OA\Response(
    *           response=401,
    *           description="Unauthenticated",
    *           @OA\JsonContent(
    *               @OA\Property(property="message", type="string", example="Unauthenticated."),
    *           )
    *       ),
    *   )
    */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'expires_at' => 'required|date',
            'never_expires' => 'required|boolean',
        ]);

        $apiKey = new ApiKey;
        $apiKey->user_id = $request->user()->id;
        $apiKey->key = bin2hex(random_bytes(32));
        $apiKey->name = $validated['name'];
        $apiKey->description = $validated['description'];
        $apiKey->expires_at = $validated['never_expires'] ? null : $validated['expires_at'];
        $apiKey->save();

        return response()->json([
            'message' => 'API key created successfully',
            'data' => $apiKey,
        ], 201);
    }

    /**
    *  @OA\Post(
    *       path="/api/api-keys/{apikey_id}/recreate",
    *       tags={"API Key"},
    *       summary="Recreate an API key",
    *       description="Recreate an API key",
    *       @OA\Parameter(
    *           name="apikey_id",
    *           in="path",
    *           description="ID of the API key to recreate",
    *           required=true,
    *           @OA\Schema(
    *               type="integer",
    *               format="int64"
    *           )
    *       ),
    *       @OA\Response(
    *           response=200,
    *           description="API key recreated successfully",
    *           @OA\JsonContent(
    *               @OA\Property(property="message", type="string", example="API key recreated successfully"),
    *           )
    *       ),
    *       @OA\Response(
    *           response=404,
    *           description="API key not found",
    *           @OA\JsonContent(
    *               @OA\Property(property="message", type="string", example="API key not found"),
    *           )
    *       ),
    *   )
    */
    public function recreate($apikey_id)
    {
        $apiKey = ApiKey::find($apikey_id);

        if (!$apiKey) {
            return response()->json([
                'message' => 'API key not found',
            ], 404);
        }

        $apiKey->key = bin2hex(random_bytes(32));
        $apiKey->save();

        return response()->json([
            'message' => 'API key recreated successfully',
            'data' => $apiKey,
        ], 200);
    }

    /**
    * @OA\Delete(
    *       path="/api/api-keys/{apikey_id}",
    *       tags={"API Key"},
    *       summary="Delete an API key",
    *       description="Delete an API key",
    *       @OA\Parameter(
    *           name="apikey_id",
    *           in="path",
    *           description="ID of the API key to delete",
    *           required=true,
    *           @OA\Schema(
    *               type="integer",
    *               format="int64"
    *           )
    *       ),
    *       @OA\Response(
    *           response=200,
    *           description="API key deleted successfully",
    *           @OA\JsonContent(
    *               @OA\Property(property="message", type="string", example="API key deleted successfully"),
    *           )
    *       ),
    *       @OA\Response(
    *           response=404,
    *           description="API key not found",
    *           @OA\JsonContent(
    *               @OA\Property(property="message", type="string", example="API key not found"),
    *           )
    *       ),
    *   )
    */
    public function destroy($apikey_id)
    {
        $apiKey = ApiKey::find($apikey_id);

        if (!$apiKey) {
            return response()->json([
                'message' => 'API key not found',
            ], 404);
        }

        $apiKey->delete();

        return response()->json([
            'message' => 'API key deleted successfully',
        ], 200);
    }

    /**
    * @OA\Get(
    *       path="/api/api-keys",
    *       tags={"API Key"},
    *       summary="Get all API keys",
    *       description="Get all API keys",
    *       @OA\Response(
    *           response=200,
    *           description="API keys retrieved successfully",
    *           @OA\JsonContent(
    *               @OA\Property(property="message", type="string", example="API keys retrieved successfully"),
    *           )
    *       ),
    *   )
    */
    public function index(){
        // get all api keys but remove key from the response
        $apiKeys = ApiKey::all()->makeHidden('key');
        return response()->json($apiKeys, 200);
    }
}
