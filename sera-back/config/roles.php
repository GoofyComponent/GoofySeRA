<?php

// Here with the url name as key we can define the roles that can access to the route : show, index, store, update, destroy

return [
    "cursus_director" => [
        "projects-requests" => ["show", "index", "store", "update", "destroy"],
        "users" => ["show", "index", "store", "update", "destroy"],
        "projects" => ["show", "index", "store", "update", "destroy"],
    ],
    "project_manager" => [
        "projects-requests" => ["show", "index", "update"],
        "users" => ["show", "index", "store", "update", "destroy"],
        "projects" => ["show", "index", "store", "update", "destroy"],
    ],
    "professor" => [
        "users" => ["show", "index"],
        "projects" => ["show", "index"],
    ],
    "video_team" => [
        "users" => ["show", "index"],
        "projects" => ["show", "index"],
    ],
    "video_editor" => [
        "users" => ["show", "index"],
        "projects" => ["show", "index"],
    ],
    "transcription_team" => [
        "users" => ["show", "index"],
        "projects" => ["show", "index"],
    ],
    "traduction_team" => [
        "users" => ["show", "index"],
        "projects" => ["show", "index"],
    ],
    "editorial_team" => [
        "users" => ["show", "index"],
        "projects" => ["show", "index"],
    ],
];
