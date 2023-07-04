<?php

// Here with the url name as key we can define the roles that can access to the route : show, index, store, update, destroy

return [
    "cursus_director" => [
        "projects-requests" => ["show", "index", "store", "update", "destroy"],
    ],
    "project_manager" => [
        "projects-requests" => ["show", "index", "update"],
    ],
    "professor" => [],
    "video_team" => [],
    "video_editor" => [],
    "transcription_team" => [],
    "traduction_team" => [],
    "editorial_team" => [],
];
