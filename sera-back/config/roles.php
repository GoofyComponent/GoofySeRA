<?php

// Here with the url name as key we can define the roles that can access to the route : show, index, store, update, destroy

return [
    "cursus_director" => [
        "projects-requests" => ["show", "index", "store", "update", "destroy"],
        "users" => ["show", "index", "store", "update", "destroy", "roles", "image"],
        "projects" => ["show", "index", "store", "update", "destroy", "init","stepsGet","stepsUpdateDate"],
        "teams" => ["add", "index", "show", "remove"],
        "rooms" => ["show", "index", "store", "update", "destroy", "reserve"],
    ],
    "project_manager" => [
        "projects-requests" => ["show", "index", "update"],
        "users" => ["show", "index", "store", "update", "destroy", "roles", "image"],
        "projects" => ["show", "index", "store", "update", "destroy", "init","stepsGet","stepsUpdateDate"],
        "teams" => ["add", "index", "show", "remove"],
        "rooms" => ["show", "index", "reserve"],
    ],
    "professor" => [
        "users" => ["show", "index", "roles", "image"],
        "projects" => ["show", "index","stepsGet"],
        "teams" => ["show"],
        "rooms" => ["show", "index"],
    ],
    "video_team" => [
        "users" => ["show", "index", "roles", "image"],
        "projects" => ["show", "index","stepsGet"],
        "teams" => ["show"],
        "rooms" => ["show", "index"],
    ],
    "video_editor" => [
        "users" => ["show", "index", "roles", "image"],
        "projects" => ["show", "index"],
        "teams" => ["show"],
        "rooms" => ["show", "index"],
    ],
    "transcription_team" => [
        "users" => ["show", "index", "roles", "image"],
        "projects" => ["show", "index","stepsGet"],
        "teams" => ["show"],
        "rooms" => ["show", "index"],
    ],
    "traduction_team" => [
        "users" => ["show", "index", "roles", "image"],
        "projects" => ["show", "index","stepsGet"],
        "teams" => ["show"],
        "rooms" => ["show", "index"],
    ],
    "editorial_team" => [
        "users" => ["show", "index", "roles", "image"],
        "projects" => ["show", "index","stepsGet"],
        "teams" => ["show"],
        "rooms" => ["show", "index"],
    ],
];
