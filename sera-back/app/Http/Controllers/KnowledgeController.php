<?php

namespace App\Http\Controllers;

use App\Models\Knowledge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class KnowledgeController extends Controller
{
    /**
    * @OA\Get(
    *      path="/api/knowledges",
    *      operationId="getKnowledgesList",
    *      tags={"Knowledges"},
    *      summary="Get list of knowledges",
    *      description="Returns list of knowledges",
    *      @OA\Response(
    *          response=200,
    *          description="Successful operation",
    *          @OA\JsonContent(
    *              type="array",
    *              @OA\Items(
    *                  type="object",
    *                  @OA\Property(property="id", type="integer", example=1),
    *                  @OA\Property(property="name", type="string", example="Knowledge 1"),
    *                  @OA\Property(property="infos", type="string", example="Infos about knowledge 1"),
    *                  @OA\Property(property="type", type="string", example="video"),
    *                  @OA\Property(property="imageURL", type="string", example="https://sera-bucket.s3.eu-west-3.amazonaws.com/knowledges/1621538100.jpg"),
    *                  @OA\Property(property="created_at", type="string", format="date-time", example="2021-05-20 08:55:00"),
    *                  @OA\Property(property="updated_at", type="string", format="date-time", example="2021-05-20 08:55:00"),
    *              )
    *          )
    *       ),
    *       @OA\Response(
    *          response=401,
    *          description="Unauthenticated",
    *       ),
    *       @OA\Response(
    *          response=403,
    *          description="Forbidden"
    *       )
    *     )
    */
    public function index()
    {
        $knowledges = Knowledge::get();

        return response()->json($knowledges, 201);
    }

    /**
    * @OA\Post(
    *      path="/api/knowledges",
    *      operationId="storeKnowledge",
    *      tags={"Knowledges"},
    *      summary="Store new knowledge",
    *      description="Returns knowledge data",
    *      @OA\RequestBody(
    *          required=true,
    *          @OA\JsonContent(
    *              required={"name","infos","type"},
    *              @OA\Property(property="name", type="string", example="Knowledge 1"),
    *              @OA\Property(property="infos", type="string", example="Infos about knowledge 1"),
    *              @OA\Property(property="type", type="string", example="video"),
    *              @OA\Property(property="image", type="string", format="binary", example=""),
    *          ),
    *      ),
    *      @OA\Response(
    *          response=201,
    *          description="Successful operation",
    *          @OA\JsonContent(
    *              type="object",
    *              @OA\Property(property="id", type="integer", example=1),
    *              @OA\Property(property="name", type="string", example="Knowledge 1"),
    *              @OA\Property(property="infos", type="string", example="Infos about knowledge 1"),
    *              @OA\Property(property="type", type="string", example="video"),
    *              @OA\Property(property="imageURL", type="string", example="https://sera-bucket.s3.eu-west-3.amazonaws.com/knowledges/1621538100.jpg"),
    *              @OA\Property(property="created_at", type="string", format="date-time", example="2021-05-20 08:55:00"),
    *              @OA\Property(property="updated_at", type="string", format="date-time", example="2021-05-20 08:55:00"),
    *          )
    *       ),
    *       @OA\Response(
    *          response=400,
    *          description="Bad request",
    *       ),
    *       @OA\Response(
    *          response=401,
    *          description="Unauthenticated",
    *       ),
    *       @OA\Response(
    *          response=403,
    *          description="Forbidden"
    *       )
    *     )
    */
    public function store(Request $request)
    {
        $acceptedTypes = config('knowledge-type');

        $validated = $request->validate([
            'name' => 'required|string',
            'infos' => 'required|string',
            'type' => 'required|string|in:'.implode(',', $acceptedTypes),
            'image' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $knowledge = new Knowledge();
        $knowledge->name = $validated['name'];
        $knowledge->infos = $validated['infos'];
        $knowledge->type = $validated['type'];

        if ($request->image != null) {
            $timestamp = time();
            $path = $request->image->storeAs(
                'knowledges',
                $timestamp . '.' . $request->image->extension(),
                's3'
            );
            if (!$path) {
                return response()->json([
                    'message' => 'Erreur lors de l\'upload du fichier'
                ], 400);
            }
            $knowledge->imageURL = $path;
        }

        $knowledge->save();

        return response()->json($knowledge, 201);
    }

    /**
    * @OA\Get(
    *      path="/api/knowledges/{id}",
    *      operationId="getKnowledgeById",
    *      tags={"Knowledges"},
    *      summary="Get knowledge information",
    *      description="Returns knowledge data",
    *      @OA\Parameter(
    *          name="id",
    *          description="Knowledge id",
    *          required=true,
    *          in="path",
    *          @OA\Schema(
    *              type="integer",
    *              format="int64"
    *          )
    *      ),
    *      @OA\Response(
    *          response=200,
    *          description="Successful operation",
    *          @OA\JsonContent(
    *              type="object",
    *              @OA\Property(property="id", type="integer", example=1),
    *              @OA\Property(property="name", type="string", example="Knowledge 1"),
    *              @OA\Property(property="infos", type="string", example="Infos about knowledge 1"),
    *              @OA\Property(property="type", type="string", example="video"),
    *              @OA\Property(property="imageURL", type="string", example="https://sera-bucket.s3.eu-west-3.amazonaws.com/knowledges/1621538100.jpg"),
    *              @OA\Property(property="created_at", type="string", format="date-time", example="2021-05-20 08:55:00"),
    *              @OA\Property(property="updated_at", type="string", format="date-time", example="2021-05-20 08:55:00"),
    *          )
    *       ),
    *       @OA\Response(
    *          response=404,
    *          description="Knowledge not found",
    *       ),
    *       @OA\Response(
    *          response=401,
    *          description="Unauthenticated",
    *       ),
    *       @OA\Response(
    *          response=403,
    *          description="Forbidden"
    *       )
    *     )
    */
    public function show($id)
    {
        $knowledge = Knowledge::find($id);

        if ($knowledge == null) {
            return response()->json(['error' => 'Knowledge not found.'], 404);
        }

        return response()->json($knowledge, 201);
    }

    /**
    * @OA\Post(
    *      path="/api/knowledges/{id}",
    *      operationId="updateKnowledge",
    *      tags={"Knowledges"},
    *      summary="Update existing knowledge",
    *      description="Returns updated knowledge data",
    *      @OA\Parameter(
    *          name="id",
    *          description="Knowledge id",
    *          required=true,
    *          in="path",
    *          @OA\Schema(
    *              type="integer",
    *              format="int64"
    *          )
    *      ),
    *      @OA\RequestBody(
    *          required=true,
    *          @OA\JsonContent(
    *              required={"name","infos","type"},
    *              @OA\Property(property="name", type="string", example="Knowledge 1"),
    *              @OA\Property(property="infos", type="string", example="Infos about knowledge 1"),
    *              @OA\Property(property="type", type="string", example="video"),
    *              @OA\Property(property="image", type="string", format="binary", example=""),
    *          ),
    *      ),
    *      @OA\Response(
    *          response=201,
    *          description="Successful operation",
    *          @OA\JsonContent(
    *              type="object",
    *              @OA\Property(property="id", type="integer", example=1),
    *              @OA\Property(property="name", type="string", example="Knowledge 1"),
    *              @OA\Property(property="infos", type="string", example="Infos about knowledge 1"),
    *              @OA\Property(property="type", type="string", example="video"),
    *              @OA\Property(property="imageURL", type="string", example="https://sera-bucket.s3.eu-west-3.amazonaws.com/knowledges/1621538100.jpg"),
    *              @OA\Property(property="created_at", type="string", format="date-time", example="2021-05-20 08:55:00"),
    *              @OA\Property(property="updated_at", type="string", format="date-time", example="2021-05-20 08:55:00"),
    *          )
    *       ),
    *       @OA\Response(
    *          response=400,
    *          description="Bad request",
    *       ),
    *       @OA\Response(
    *          response=404,
    *          description="Knowledge not found",
    *       ),
    *       @OA\Response(
    *          response=401,
    *          description="Unauthenticated",
    *       ),
    *       @OA\Response(
    *          response=403,
    *          description="Forbidden"
    *       )
    *     )
    */
    public function update(Request $request, $id)
    {
        $knowledge = Knowledge::find($id);

        if ($knowledge == null) {
            return response()->json(['error' => 'Knowledge not found.'], 404);
        }

        $acceptedTypes = config('knowledge-type');

        $validated = $request->validate([
            'name' => 'string',
            'infos' => 'string',
            'type' => 'string|in:'.implode(',', $acceptedTypes),
            'image' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->filled('name')){
            $knowledge->name = $validated['name'];
        }
        if ($request->filled('infos')){
            $knowledge->infos = $validated['infos'];
        }
        if ($request->filled('type')){
            $knowledge->type = $validated['type'];
        }
        if ($request->image != null) {
            $previousPath = $knowledge->imageURL;
            if ($previousPath != null){
                Storage::disk('s3')->delete($previousPath);
            }
            $timestamp = time();

            $path = $request->image->storeAs(
                'knowledges',
                $timestamp . '.' . $request->image->extension(),
                's3'
            );
            if (!$path) {
                return response()->json([
                    'message' => 'Erreur lors de l\'upload du fichier'
                ], 400);
            }
            $knowledge->imageURL = $path;
        }

        $knowledge->save();
        return response()->json($knowledge, 201);
    }

    /**
    * @OA\Delete(
    *      path="/api/knowledges/{id}",
    *      operationId="deleteKnowledge",
    *      tags={"Knowledges"},
    *      summary="Delete existing knowledge",
    *      description="Deletes a record and returns no content",
    *      @OA\Parameter(
    *          name="id",
    *          description="Knowledge id",
    *          required=true,
    *          in="path",
    *          @OA\Schema(
    *              type="integer",
    *              format="int64"
    *          )
    *      ),
    *      @OA\Response(
    *          response=201,
    *          description="Successful operation",
    *          @OA\JsonContent(
    *              type="object",
    *              @OA\Property(property="message", type="string", example="Knowledge deleted."),
    *          )
    *       ),
    *       @OA\Response(
    *          response=404,
    *          description="Knowledge not found",
    *       ),
    *       @OA\Response(
    *          response=401,
    *          description="Unauthenticated",
    *       ),
    *       @OA\Response(
    *          response=403,
    *          description="Forbidden"
    *       )
    *     )
    */
    public function destroy($id)
    {
        $knowledge = Knowledge::find($id);

        if ($knowledge == null) {
            return response()->json(['error' => 'Knowledge not found.'], 404);
        }


        if ($knowledge->imageURL != null){
            Storage::disk('s3')->delete($knowledge->imageURL);
        }

        $knowledge->delete();

        return response()->json(['message' => 'Knowledge deleted.'], 201);
    }
}
