<?php

// Here with the url name as key we can define the roles that can access to the route : show, index, store, update, destroy

return [
    "cursus_director" => [
        "projects-requests" => ["show", "index", "store", "update", "destroy"],
        "users" => ["show", "index", "store", "update", "destroy", "roles"],
        "projects" => ["show", "index", "store", "update", "destroy"],
        "teams" => ["add", "index", "show","remove"],
    ],
    "project_manager" => [
        "projects-requests" => ["show", "index", "update"],
        "users" => ["show", "index", "store", "update", "destroy", "roles"],
        "projects" => ["show", "index", "store", "update", "destroy","steps0-1"],
        "teams" => ["add", "index", "show","remove"],
    ],
    "professor" => [
        "users" => ["show", "index", "roles"],
        "projects" => ["show", "index"],
        "teams" => ["show"],
    ],
    "video_team" => [
        "users" => ["show", "index", "roles"],
        "projects" => ["show", "index"],
        "teams" => ["show"],
    ],
    "video_editor" => [
        "users" => ["show", "index", "roles"],
        "projects" => ["show", "index"],
        "teams" => ["show"],
    ],
    "transcription_team" => [
        "users" => ["show", "index", "roles"],
        "projects" => ["show", "index"],
        "teams" => ["show"],
    ],
    "traduction_team" => [
        "users" => ["show", "index", "roles"],
        "projects" => ["show", "index"],
        "teams" => ["show"],
    ],
    "editorial_team" => [
        "users" => ["show", "index", "roles"],
        "projects" => ["show", "index"],
        "teams" => ["show"],
    ],
];
