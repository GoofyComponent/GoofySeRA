<?php
use Carbon\Carbon;

return [
    "Planning" => [
        "description" => "Prepare all the necessary elements.",
        "status" => "ongoing",
        "start_date" => Carbon::now()->toDateString(),
        "end_date" => Carbon::now()->addDays(7)->toDateString(),
    ],
    "Capture" => [
        "description" => "Drop or get the elements.",
        "status" => "not_started",
        "start_date" => null,
        "end_date" => null,
        "link" =>null,
    ],
    "Post-Production" => [
        "description" => "Send & review the video.",
        "status" => "not_started",
        "start_date" => null,
        "end_date" => null,
    ],
    "Transcription" => [
        "description" => "Transcript the video.",
        "status" => "not_started",
        "start_date" => null,
        "end_date" => null,
    ],
    "Subtitling" => [
        "description" => "Translate the video.",
        "status" => "not_started",
        "start_date" => null,
        "end_date" => null,
    ],
    "Editorial" => [
        "description" => "Add the essential elements & publish the video.",
        "status" => "not_started",
        "start_date" => null,
        "end_date" => null,
        "have_edito" => false,
    ]
];
