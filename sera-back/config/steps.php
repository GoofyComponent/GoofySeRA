<?php
use Carbon\Carbon;

return [
    "Planning" => [
        "description" => "Plans the necessary resources, such as the venue and accessories, assigns tasks to relevant individuals, and schedules a date. The next step is initiated once everything is ready, including materials, participants, and the venue",
        "status" => "ongoing",
        "start_date" => Carbon::now()->toDateString(),
        "end_date" => Carbon::now()->addDays(7)->toDateString(),
    ],
    "Capture" => [
        "description" => "This is the most important step in the process. The event is captured using a camera, and the footage is stored on a computer. Before we pass on to the next step, we must ensure that the footage is of high quality. However, if the footage is of poor quality, we must repeat the process.",
        "status" => "not_started",
        "start_date" => null,
        "end_date" => null,
        "link" =>null,
    ],
    "Post-Production" => [
        "description" => "The editing team can retrieve the footage and begin editing. It can request a review from the project organizer, who can confirm that it is good for him. If this is not the case, a review system with a timecode-identified comment system is started to make the requested changes. (All of this in a version system)",
        "status" => "not_started",
        "start_date" => null,
        "end_date" => null,
    ],
    "Transcription" => [
        "description" => "Transcript the video. The transcription is then reviewed by the project organizer, who can make any necessary changes. (All of this in a version system)",
        "status" => "not_started",
        "start_date" => null,
        "end_date" => null,
    ],
    "Subtitling" => [
        "description" => "The transcription is then translated into the desired languages. The translation is then reviewed by the project organizer, who can make any necessary changes. (All of this in a version system)",
        "status" => "not_started",
        "start_date" => null,
        "end_date" => null,
    ],
    "Editorial" => [
        "description" => "The editorial team can now access the project and fill in the name, description, images, biographies, and analyses. The project organizer can then review the editorial team\"s work and make any necessary changes. (All of this in a version system)",
        "status" => "not_started",
        "start_date" => null,
        "end_date" => null,
    ]
];
