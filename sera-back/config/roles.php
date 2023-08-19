<?php

// Here with the url name as key we can define the roles that can access to the route : show, index, store, update, destroy

return [
    "cursus_director" => [
        "projects-requests" => ["show", "index", "store", "update", "destroy"],
        "users" => ["show", "index", "store", "update", "destroy", "roles", "image"],
        "projects" => ["show", "index", "store", "update", "destroy", "init","stepsGet","stepsUpdateDate"],
        "teams" => ["add", "index", "show", "remove"],
        "rooms" => ["show", "index", "store", "update", "destroy", "reserve"],
        "shared-ressources" => ["show", "index", "store", "update", "destroy"],
    ],
    "project_manager" => [
        "projects-requests" => ["show", "index", "update"],
        "users" => ["show", "index", "store", "update", "destroy", "roles", "image"],
        "projects" => ["show", "index", "store", "update", "destroy", "init","stepsGet","stepsUpdateDate"],
        "teams" => ["add", "index", "show", "remove"],
        "rooms" => ["show", "index", "reserve"],
        "shared-ressources" => ["show", "index", "store", "update", "destroy"],
    ],
    "professor" => [
        "users" => ["show", "index", "roles", "image"],
        "projects" => ["show", "index","stepsGet"],
        "teams" => ["show"],
        "rooms" => ["show", "index"],
        "shared-ressources" => ["show", "index", "store", "update", "destroy"],
    ],
    "video_team" => [
        "users" => ["show", "index", "roles", "image"],
        "projects" => ["show", "index","stepsGet"],
        "teams" => ["show"],
        "rooms" => ["show", "index"],
        "shared-ressources" => ["show", "index", "store", "update", "destroy"],
    ],
    "video_editor" => [
        "users" => ["show", "index", "roles", "image"],
        "projects" => ["show", "index"],
        "teams" => ["show"],
        "rooms" => ["show", "index"],
        "shared-ressources" => ["show", "index", "store", "update", "destroy"],
    ],
    "transcription_team" => [
        "users" => ["show", "index", "roles", "image"],
        "projects" => ["show", "index","stepsGet"],
        "teams" => ["show"],
        "rooms" => ["show", "index"],
        "shared-ressources" => ["show", "index", "store", "update", "destroy"],
    ],
    "traduction_team" => [
        "users" => ["show", "index", "roles", "image"],
        "projects" => ["show", "index","stepsGet"],
        "teams" => ["show"],
        "rooms" => ["show", "index"],
        "shared-ressources" => ["show", "index", "store", "update", "destroy"],
    ],
    "editorial_team" => [
        "users" => ["show", "index", "roles", "image"],
        "projects" => ["show", "index","stepsGet"],
        "teams" => ["show"],
        "rooms" => ["show", "index"],
        "shared-ressources" => ["show", "index", "store", "update", "destroy"],
    ],
];
