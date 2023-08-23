<?php

// Here with the url name as key we can define the roles that can access to the route : show, index, store, update, destroy

return [
    "cursus_director" => [
        "projects-requests" => ["show", "index", "store", "update", "destroy"],
        "users" => ["show", "index", "store", "update", "destroy", "roles", "image", "password","reservations","reservations"],
        "projects" => ["show", "index", "store", "update", "destroy", "init","stepsGet","stepsUpdateDate","planificationToCaptation","addLink","captationToPostproduction"],
        "teams" => ["add", "index", "show", "remove"],
        "rooms" => ["show", "index", "store", "update", "destroy", "reserve","unreserve","available"]
    ],
    "project_manager" => [
        "projects-requests" => ["show", "index", "update"],
        "users" => ["show", "index", "store", "update", "destroy", "roles", "image", "password","reservations"],
        "projects" => ["show", "index", "store", "update", "destroy", "init","stepsGet","stepsUpdateDate","planificationToCaptation","addLink","captationToPostproduction"],
        "teams" => ["add", "index", "show", "remove"],
        "rooms" => ["show", "index", "reserve","unreserve","available"],
    ],
    "professor" => [
        "users" => ["show", "index", "roles", "image", "password","reservations"],
        "projects" => ["show", "index","stepsGet"],
        "teams" => ["show"],
        "rooms" => ["show", "index","available"],
    ],
    "video_team" => [
        "users" => ["show", "index", "roles", "image", "password","reservations"],
        "projects" => ["show", "index","stepsGet","addLink"],
        "teams" => ["show"],
        "rooms" => ["show", "index","available"],
    ],
    "video_editor" => [
        "users" => ["show", "index", "roles", "image", "password","reservations"],
        "projects" => ["show", "index"],
        "teams" => ["show"],
        "rooms" => ["show", "index","available"],
    ],
    "transcription_team" => [
        "users" => ["show", "index", "roles", "image", "password","reservations"],
        "projects" => ["show", "index","stepsGet"],
        "teams" => ["show"],
        "rooms" => ["show", "index","available"],
    ],
    "traduction_team" => [
        "users" => ["show", "index", "roles", "image", "password","reservations"],
        "projects" => ["show", "index","stepsGet"],
        "teams" => ["show"],
        "rooms" => ["show", "index","available"],
    ],
    "editorial_team" => [
        "users" => ["show", "index", "roles", "image", "password","reservations"],
        "projects" => ["show", "index","stepsGet"],
        "teams" => ["show"],
        "rooms" => ["show", "index","available"],
    ],
];
