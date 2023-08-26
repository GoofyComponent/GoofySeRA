<?php

namespace App\Http\Controllers;

use App\Models\VideoReview;
use Illuminate\Http\Request;

class VideoReviewController extends Controller
{
    /**
    * @OA\Get(
    *      path="/api/projects/{projectId}/video-reviews",
    *      operationId="getReviewsByProjectId",
    *      tags={"Video Review"},
    *      summary="Get reviews by project id",
    *      description="Returns reviews by project id",
    *      @OA\Parameter(
    *          name="projectId",
    *          description="Project id",
    *          required=true,
    *          in="path",
    *          @OA\Schema(
    *              type="integer"
    *          )
    *      ),
    *      @OA\Parameter(
    *          name="version",
    *          description="Version of the review",
    *          required=false,
    *          in="query",
    *          @OA\Schema(
    *              type="integer"
    *          )
    *      ),
    *      @OA\Response(
    *          response=200,
    *          description="Successful operation",
    *          @OA\JsonContent(
    *              @OA\Property(
    *                  property="id",
    *                  type="integer",
    *                  example="1"
    *              ),
    *              @OA\Property(
    *                  property="project_id",
    *                  type="integer",
    *                  example="1"
    *              ),
    *              @OA\Property(
    *                  property="reviews",
    *                  type="array",
    *                  @OA\Items(
    *                      @OA\Property(
    *                          property="version",
    *                          type="integer",
    *                          example="1"
    *                      ),
    *                      @OA\Property(
    *                          property="video",
    *                          type="object",
    *                          @OA\Property(
    *                              property="type",
    *                              type="string",
    *                              example="video"
    *                          ),
    *                          @OA\Property(
    *                              property="title",
    *                              type="string",
    *                              example="Fuji"
    *                          ),
    *                          @OA\Property(
    *                              property="sources",
    *                              type="array",
    *                              @OA\Items(
    *                                  @OA\Property(
    *                                      property="size",
    *                                      type="integer",
    *                                      example="1440"
    *                                  ),
    *                                  @OA\Property(
    *                                      property="provider",
    *                                      type="string",
    *                                      example="html"
    *                                  ),
    *                                  @OA\Property(
    *                                      property="src",
    *                                      type="string",
    *                                      example="http://localhost/storage/videos-example/fuji-1440.mp4"
    *                                  ),
    *                                  @OA\Property(
    *                                      property="type",
    *                                      type="string",
    *                                      example="video/mp4"
    *                                  ),
    *                              )
    *                          ),
    *                      ),
    *                      @OA\Property(
    *                          property="comments",
    *                          type="array",
    *                          @OA\Items(
    *                              @OA\Property(
    *                                  property="author",
    *                                  type="object",
    *                                  @OA\Property(
    *                                      property="nickname",
    *                                      type="string",
    *                                      example="user1"
    *                                  ),
    *                                  @OA\Property(
    *                                      property="avatar",
    *                                      type="string",
    *                                      example="https://i.pravatar.cc/300"
    *                                  ),
    *                                  @OA\Property(
    *                                      property="job",
    *                                      type="string",
    *                                      example="Software Engineer"
    *                                  ),
    *                              ),
    *                              @OA\Property(
    *                                  property="message",
    *                                  type="string",
    *                                  example="hello"
    *                              ),
    *                              @OA\Property(
    *                                  property="timestamp",
    *                                  type="string",
    *                                  example="2021-05-01 12:00:00"
    *                              ),
    *                          )
    *                      ),
    *                  )
    *              ),
    *              @OA\Property(
    *                  property="created_at",
    *                  type="string",
    *                  example="2021-05-01 12:00:00"
    *              ),
    *              @OA\Property(
    *                  property="updated_at",
    *                  type="string",
    *                  example="2021-05-01 12:00:00"
    *              ),
    *          )
    *      ),
    *      @OA\Response(
    *          response=404,
    *          description="No reviews found",
    *          @OA\JsonContent(
    *              @OA\Property(
    *                  property="message",
    *                  type="string",
    *                  example="No reviews found"
    *              ),
    *          )
    *      ),
    *      @OA\Response(
    *          response=422,
    *          description="Validation error",
    *          @OA\JsonContent(
    *              @OA\Property(
    *                  property="message",
    *                  type="string",
    *                  example="The given data was invalid."
    *              ),
    *              @OA\Property(
    *                  property="errors",
    *                  type="object",
    *                  @OA\Property(
    *                      property="version",
    *                      type="array",
    *                      @OA\Items(
    *                          type="string",
    *                          example="The version must be an integer."
    *                      )
    *                  ),
    *              ),
    *          )
    *      ),
    * )
    */
    function getReviewsByProjectId(Request $request, $id)
    {
        $request->validate([
            'version' => 'integer',
        ]);

        // take first
        $videos = VideoReview::where('project_id', $id)->get()->first();

        if (!$videos) {
            return response()->json([
                'message' => 'No reviews found',
            ], 404);
        }

        $videos->reviews = json_decode($videos->reviews);

        foreach ($videos->reviews as $review) {
            if ($review->version == $request->version) {
                $videos->reviews = $review;
                break;
            }
        }

        return response()->json($videos);
    }
}
