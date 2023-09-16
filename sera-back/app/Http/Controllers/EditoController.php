<?php

namespace App\Http\Controllers;

use App\Models\Edito;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class EditoController extends Controller
{
    /**
    * @OA\Get(
    *      path="/api/projects/{project_id}/edito",
    *      operationId="getEditoByProjectId",
    *      tags={"Edito"},
    *      summary="Get Edito by project id",
    *      description="Returns Edito data",
    *      @OA\Parameter(
    *          name="project_id",
    *          description="Project id",
    *          required=true,
    *          in="path",
    *          @OA\Schema(
    *              type="integer"
    *          )
    *      ),
    *      @OA\Response(
    *          response=200,
    *          description="successful operation",
    *          @OA\JsonContent(
    *              type="object",
    *              @OA\Property(
    *                  property="id",
    *                  type="integer"
    *              ),
    *              @OA\Property(
    *                  property="title",
    *                  type="string"
    *              ),
    *              @OA\Property(
    *                  property="description",
    *                  type="string"
    *              ),
    *              @OA\Property(
    *                  property="images",
    *                  type="array",
    *                  @OA\Items(
    *                      type="string"
    *                  )
    *              ),
    *              @OA\Property(
    *                  property="project_id",
    *                  type="integer"
    *              ),
    *              @OA\Property(
    *                  property="created_at",
    *                  type="string"
    *              ),
    *              @OA\Property(
    *                  property="updated_at",
    *                  type="string"
    *              ),
    *          )
    *      ),
    *      @OA\Response(
    *          response=404,
    *          description="Edito not found"
    *      ),
    *      @OA\Response(
    *          response=400,
    *          description="Project not found"
    *      ),
    * )
    */
    public function index($project_id)
    {
        $edito = Edito::where('project_id', $project_id)->with('knowledges')->first();
        return response()->json($edito);
    }

    /**
    * @OA\Post(
    *      path="/api/projects/{project_id}/edito",
    *      operationId="storeEdito",
    *      tags={"Edito"},
    *      summary="Store Edito",
    *      description="Store Edito",
    *      @OA\Parameter(
    *          name="project_id",
    *          description="Project id",
    *          required=true,
    *          in="path",
    *          @OA\Schema(
    *              type="integer"
    *          )
    *      ),
    *      @OA\RequestBody(
    *          required=true,
    *          @OA\JsonContent(
    *              required={"title", "description"},
    *              @OA\Property(
    *                  property="title",
    *                  type="string"
    *              ),
    *              @OA\Property(
    *                  property="description",
    *                  type="string"
    *              ),
    *              @OA\Property(
    *                  property="images",
    *                  type="array",
    *                  @OA\Items(
    *                      type="string",
    *                      format="binary"
    *                  )
    *              ),
    *          ),
    *      ),
    *      @OA\Response(
    *          response=201,
    *          description="successful operation",
    *          @OA\JsonContent(
    *              type="object",
    *              @OA\Property(
    *                  property="id",
    *                  type="integer"
    *              ),
    *              @OA\Property(
    *                  property="title",
    *                  type="string"
    *              ),
    *              @OA\Property(
    *                  property="description",
    *                  type="string"
    *              ),
    *              @OA\Property(
    *                  property="images",
    *                  type="array",
    *                  @OA\Items(
    *                      type="string"
    *                  )
    *              ),
    *              @OA\Property(
    *                  property="project_id",
    *                  type="integer"
    *              ),
    *              @OA\Property(
    *                  property="created_at",
    *                  type="string"
    *              ),
    *              @OA\Property(
    *                  property="updated_at",
    *                  type="string"
    *              ),
    *          )
    *      ),
    *      @OA\Response(
    *          response=404,
    *          description="Project not found"
    *      ),
    *      @OA\Response(
    *          response=400,
    *          description="Project already has an edito"
    *      ),
    * )
    */
    public function store(Request $request, $project_id)
    {
        $validatedData = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'images.*' => ['image', 'mimes:jpeg,png,jpg,gif,svg'],
        ]);

        $project = Project::find($project_id);

        if (!$project) {
            return response()->json([
                'message' => 'Project not found'
            ], 404);
        }

        if ($project->edito) {
            return response()->json([
                'message' => 'Project already has an edito'
            ], 400);
        }

        $edito = new Edito();
        $edito->title = $validatedData['title'];
        $edito->description = $validatedData['description'];
        $edito->project_id = $project_id;
        $imageArray = [];
        if ($request->has('images')) {

            foreach ($request->file('images') as $image) {
                $imagePath = "ressources/edito/" . $project_id;
                // le name est le timestamp + l'extension
                $name = time() . '.' . $image->getClientOriginalExtension();

                Storage::disk('s3')->put($imagePath . '/' . $name, file_get_contents($image));
                $imageArray[] = $imagePath . '/' . $name;
            }

            $edito->images = json_encode($imageArray);
        }

        $edito->save();

        $steps = json_decode($project->steps);
        $steps->{'Editorial'}->have_edito = true;
        $project->steps = json_encode($steps);

        $project->save();


        return response()->json($edito, 201);
    }

    /**
     * @OA\Post(
     *      path="/api/projects/{project_id}/edito/update",
     *      operationId="updateEdito",
     *      tags={"Edito"},
     *      summary="Update Edito",
     *      description="Update Edito",
     *      @OA\Parameter(
     *          name="project_id",
     *          description="Project id",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="integer"
     *          )
     *      ),
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(
     *              @OA\Property(
     *                  property="title",
     *                  type="string"
     *              ),
     *              @OA\Property(
     *                  property="description",
     *                  type="string"
     *              ),
     *              @OA\Property(
     *                  property="images",
     *                  type="array",
     *                  @OA\Items(
     *                      type="string",
     *                      format="binary"
     *                  )
     *              ),
     *          ),
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="successful operation",
     *          @OA\JsonContent(
     *              type="object",
     *              @OA\Property(
     *                  property="id",
     *                  type="integer"
     *              ),
     *              @OA\Property(
     *                  property="title",
     *                  type="string"
     *              ),
     *              @OA\Property(
     *                  property="description",
     *                  type="string"
     *              ),
     *              @OA\Property(
     *                  property="images",
     *                  type="array",
     *                  @OA\Items(
     *                      type="string"
     *                  )
     *              ),
     *              @OA\Property(
     *                  property="project_id",
     *                  type="integer"
     *              ),
     *              @OA\Property(
     *                  property="created_at",
     *                  type="string"
     *              ),
     *              @OA\Property(
     *                  property="updated_at",
     *                  type="string"
     *              ),
     *          )
     *      ),
     *      @OA\Response(
     *          response=404,
     *          description="Project not found"
     *      ),
     * )
     */

    public function update(Request $request, $project_id)
    {
        $validatedData = $request->validate([
            'title' => ['string', 'max:255'],
            'description' => ['string'],
            'images.*' => ['image', 'mimes:jpeg,png,jpg,gif,svg'],
        ]);

        $project = Project::find($project_id);

        if (!$project) {
            return response()->json([
                'message' => 'Project not found'
            ], 404);
        }

        $edito = Edito::where('project_id', $project_id)->first();

        if (!$edito) {
            return response()->json([
                'message' => 'Edito not found'
            ], 404);
        }

        if ($request->has('title')) {
            $edito->title = $validatedData['title'];
        }

        if ($request->has('description')) {
            $edito->description = $validatedData['description'];
        }

        if ($request->has('images')) {
            $imageArray = (array) json_decode($edito->images);
            $imageArray = array_values($imageArray);
            foreach ($request->file('images') as $image) {
                $imagePath = "ressources/edito/" . $project_id;
                $name = time() . '.' . $image->getClientOriginalExtension();
                Storage::disk('s3')->put($imagePath . '/' . $name, file_get_contents($image));
                $imageArray[] = $imagePath . '/' . $name;
            }

            $edito->images = json_encode($imageArray);
        }

        $edito->save();

        return response()->json($edito, 200);
    }

    /**
    * @OA\Delete(
    *      path="/api/projects/{project_id}/edito",
    *      operationId="deleteEdito",
    *      tags={"Edito"},
    *      summary="Delete Edito",
    *      description="Delete Edito",
    *      @OA\Parameter(
    *          name="project_id",
    *          description="Project id",
    *          required=true,
    *          in="path",
    *          @OA\Schema(
    *              type="integer"
    *          )
    *      ),
    *      @OA\Response(
    *          response=200,
    *          description="successful operation",
    *          @OA\JsonContent(
    *              type="object",
    *              @OA\Property(
    *                  property="message",
    *                  type="string"
    *              ),
    *          )
    *      ),
    *      @OA\Response(
    *          response=404,
    *          description="Project not found"
    *      ),
    * )
    */
    public function destroy($id)
    {

        $project = Project::find($id);

        if (!$project) {
            return response()->json([
                'message' => 'Project not found'
            ], 404);
        }

        $edito = Edito::where('project_id', $id)->first();

        if (!$edito) {
            return response()->json([
                'message' => 'Edito not found'
            ], 404);
        }

        $steps = json_decode($project->steps);

        $steps->{'Editorial'}->have_edito = false;

        $project->steps = json_encode($steps);

        $project->save();

        $edito->delete();

        return response()->json([
            'message' => 'Edito deleted'
        ], 200);

    }

    /**
    * @OA\Post(
    *     path="/api/projects/{project_id}/edito/remove-image",
    *     operationId="removeImage",
    *     tags={"Edito"},
    *     summary="Remove image from Edito",
    *     description="Remove image from Edito",
    *     @OA\Parameter(
    *         name="project_id",
    *         description="Project id",
    *         required=true,
    *         in="path",
    *         @OA\Schema(
    *             type="integer"
    *         )
    *     ),
    *     @OA\RequestBody(
    *         required=true,
    *         @OA\JsonContent(
    *             required={"image_postition"},
    *             @OA\Property(
    *                 property="image_postition",
    *                 type="integer"
    *             ),
    *         ),
    *     ),
    *     @OA\Response(
    *         response=200,
    *         description="successful operation",
    *         @OA\JsonContent(
    *             type="object",
    *             @OA\Property(
    *                 property="id",
    *                 type="integer"
    *             ),
    *             @OA\Property(
    *                 property="title",
    *                 type="string"
    *             ),
    *             @OA\Property(
    *                 property="description",
    *                 type="string"
    *             ),
    *             @OA\Property(
    *                 property="images",
    *                 type="array",
    *                 @OA\Items(
    *                     type="string"
    *                 )
    *             ),
    *             @OA\Property(
    *                 property="project_id",
    *                 type="integer"
    *             ),
    *             @OA\Property(
    *                 property="created_at",
    *                 type="string"
    *             ),
    *             @OA\Property(
    *                 property="updated_at",
    *                 type="string"
    *             ),
    *         )
    *     ),
    *     @OA\Response(
    *         response=404,
    *         description="Project not found"
    *     ),
    * )
    */
    public function removeImage(Request $request, $project_id)
    {
        $validatedData = $request->validate([
            'image_postition' => ['required', 'string'],
        ]);

        $project = Project::find($project_id);

        if (!$project) {
            return response()->json([
                'message' => 'Project not found'
            ], 404);
        }

        $edito = Edito::where('project_id', $project_id)->first();

        if (!$edito) {
            return response()->json([
                'message' => 'Edito not found'
            ], 404);
        }

        $imageArray = (array) json_decode($edito->images);
        $imageArray = array_values($imageArray);
        unset($imageArray[$validatedData['image_postition']]);
        $imageArray = array_values($imageArray);

        $edito->images = json_encode($imageArray);

        $edito->save();

        return response()->json($edito, 200);
    }


    /**
    * @OA\Post(
    *     path="/api/projects/{project_id}/edito/add-knowledge",
    *     operationId="addKnowledge",
    *     tags={"Edito"},
    *     summary="Add knowledge to Edito",
    *     description="Add knowledge to Edito",
    *     @OA\Parameter(
    *         name="project_id",
    *         description="Project id",
    *         required=true,
    *         in="path",
    *         @OA\Schema(
    *             type="integer"
    *         )
    *     ),
    *     @OA\RequestBody(
    *         required=true,
    *         @OA\JsonContent(
    *             required={"knowledge_id"},
    *             @OA\Property(
    *                 property="knowledge_id",
    *                 type="integer"
    *             ),
    *         ),
    *     ),
    *     @OA\Response(
    *         response=200,
    *         description="successful operation",
    *         @OA\JsonContent(
    *             type="object",
    *             @OA\Property(
    *                 property="id",
    *                 type="integer"
    *             ),
    *             @OA\Property(
    *                 property="title",
    *                 type="string"
    *             ),
    *             @OA\Property(
    *                 property="description",
    *                 type="string"
    *             ),
    *             @OA\Property(
    *                 property="images",
    *                 type="array",
    *                 @OA\Items(
    *                     type="string"
    *                 )
    *             ),
    *             @OA\Property(
    *                 property="knowledges",
    *                 type="array",
    *                 @OA\Items(
    *                     type="object",
    *                     @OA\Property(
    *                         property="id",
    *                         type="integer"
    *                     ),
    *                     @OA\Property(
    *                         property="name",
    *                         type="string"
    *                     ),
    *                     @OA\Property(
    *                         property="image",
    *                         type="string"
    *                     ),
    *                     @OA\Property(
    *                         property="type",
    *                         type="string"
    *                     ),
    *                     @OA\Property(
    *                         property="created_at",
    *                         type="string"
    *                     ),
    *                     @OA\Property(
    *                         property="updated_at",
    *                         type="string"
    *                     ),
    *                 )
    *             ),
    *             @OA\Property(
    *                 property="project_id",
    *                 type="integer"
    *             ),
    *             @OA\Property(
    *                 property="created_at",
    *                 type="string"
    *             ),
    *             @OA\Property(
    *                 property="updated_at",
    *                 type="string"
    *             ),
    *         )
    *     ),
    *     @OA\Response(
    *         response=404,
    *         description="Project not found"
    *     ),
    *     @OA\Response(
    *         response=400,
    *         description="Knowledge already added"
    *     ),
    * )
    */
    public function addKnowledge(Request $request, $project_id){
        $validatedData = $request->validate([
            'knowledge_id' => ['required', 'integer'],
        ]);

        $project = Project::find($project_id);

        if (!$project) {
            return response()->json([
                'message' => 'Project not found'
            ], 404);
        }

        $edito = Edito::where('project_id', $project_id)->first();

        if (!$edito) {
            return response()->json([
                'message' => 'Edito not found'
            ], 404);
        }

        if($edito->knowledges()->where('knowledge_id',$validatedData['knowledge_id'])->first()){
            return response()->json([
                'message' => 'Knowledge already added'
            ], 400);
        }

        $edito->knowledges()->attach($validatedData['knowledge_id']);

        // on charge les knowledges
        $edito->load('knowledges');

        return response()->json($edito, 200);
    }

    /**
    * @OA\Post(
    *     path="/api/projects/{project_id}/edito/remove-knowledge",
    *     operationId="unlinkKnowledge",
    *     tags={"Edito"},
    *     summary="Unlink knowledge from Edito",
    *     description="Unlink knowledge from Edito",
    *     @OA\Parameter(
    *         name="project_id",
    *         description="Project id",
    *         required=true,
    *         in="path",
    *         @OA\Schema(
    *             type="integer"
    *         )
    *     ),
    *     @OA\RequestBody(
    *         required=true,
    *         @OA\JsonContent(
    *             required={"knowledge_id"},
    *             @OA\Property(
    *                 property="knowledge_id",
    *                 type="integer"
    *             ),
    *         ),
    *     ),
    *     @OA\Response(
    *         response=200,
    *         description="successful operation",
    *         @OA\JsonContent(
    *             type="object",
    *             @OA\Property(
    *                 property="id",
    *                 type="integer"
    *             ),
    *             @OA\Property(
    *                 property="title",
    *                 type="string"
    *             ),
    *             @OA\Property(
    *                 property="description",
    *                 type="string"
    *             ),
    *             @OA\Property(
    *                 property="images",
    *                 type="array",
    *                 @OA\Items(
    *                     type="string"
    *                 )
    *             ),
    *             @OA\Property(
    *                 property="knowledges",
    *                 type="array",
    *                 @OA\Items(
    *                     type="object",
    *                     @OA\Property(
    *                         property="id",
    *                         type="integer"
    *                     ),
    *                     @OA\Property(
    *                         property="name",
    *                         type="string"
    *                     ),
    *                     @OA\Property(
    *                         property="image",
    *                         type="string"
    *                     ),
    *                     @OA\Property(
    *                         property="type",
    *                         type="string"
    *                     ),
    *                     @OA\Property(
    *                         property="created_at",
    *                         type="string"
    *                     ),
    *                     @OA\Property(
    *                         property="updated_at",
    *                         type="string"
    *                     ),
    *                 )
    *             ),
    *             @OA\Property(
    *                 property="project_id",
    *                 type="integer"
    *             ),
    *             @OA\Property(
    *                 property="created_at",
    *                 type="string"
    *             ),
    *             @OA\Property(
    *                 property="updated_at",
    *                 type="string"
    *             ),
    *         )
    *     ),
    *     @OA\Response(
    *         response=404,
    *         description="Project not found"
    *     ),
    *     @OA\Response(
    *         response=400,
    *         description="Knowledge not found"
    *     ),
    * )
    */
    public function unlinkKnowledge(Request $request, $project_id){
        $validatedData = $request->validate([
            'knowledge_id' => ['required', 'integer'],
        ]);

        $project = Project::find($project_id);

        if (!$project) {
            return response()->json([
                'message' => 'Project not found'
            ], 404);
        }

        $edito = Edito::where('project_id', $project_id)->first();

        if (!$edito) {
            return response()->json([
                'message' => 'Edito not found'
            ], 404);
        }

        if(!$edito->knowledges()->where('knowledge_id',$validatedData['knowledge_id'])->first()){
            return response()->json([
                'message' => 'Knowledge not found'
            ], 400);
        }

        $edito->knowledges()->detach($validatedData['knowledge_id']);

        // on charge les knowledges
        $edito->load('knowledges');

        return response()->json($edito, 200);
    }
}
