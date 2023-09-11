<?php

// Here with the url name as key we can define the roles that can access to the route : show, index, store, update, destroy

return [
    "cursus_director" => [
        "projects-requests" => ["show", "index", "store", "update", "destroy"],
        "users" => ["show", "index", "store", "update", "destroy", "roles", "image", "password","reservations","reservations"],
        "projects" => ["validateTranscription","getCaptionUrl","show", "index", "store", "update", "destroy", "init","stepsGet","stepsUpdateDate","planificationToCaptation","addLink","captationToPostproduction","validatePostProd"],
        "teams" => ["add", "index", "show", "remove"],
        "rooms" => ["show", "index", "store", "update", "destroy", "reserve","unreserve","available","showByProject"],
        "video-reviews" => ["getReviewsByProjectId","store","destroy","addAComment","getTemporaryUploadUrl","getVideoValidated"],
        "ressources" => ["show", "index", "store", "update", "destroy", "getTypes"],
        "transcriptions" => ["index", "store", "destroy"],
        "notifications" => ["index", "store", "show", "update", "destroy"]
    ],
    "project_manager" => [
        "projects-requests" => ["show", "index", "update"],
        "users" => ["show", "index", "store", "update", "destroy", "roles", "image", "password","reservations"],
        "projects" => ["validateTranscription","getCaptionUrl","show", "index", "store", "update", "destroy", "init","stepsGet","stepsUpdateDate","planificationToCaptation","addLink","captationToPostproduction","validatePostProd"],
        "teams" => ["add", "index", "show", "remove"],
        "rooms" => ["show", "index", "reserve","unreserve","available","showByProject"],
        "video-reviews" => ["getReviewsByProjectId","store","destroy","addAComment","getTemporaryUploadUrl","getVideoValidated"],
        "ressources" => ["show", "index", "store", "update", "destroy", "getTypes"],
        "transcriptions" => ["index", "store", "destroy"],
        "notifications" => ["index", "store", "show", "update", "destroy"]
    ],
    "professor" => [
        "users" => ["show", "index", "roles", "image", "password","reservations"],
        "projects" => ["getCaptionUrl","show", "index","stepsGet"],
        "teams" => ["show"],
        "rooms" => ["show", "index","available","showByProject"],
        "video-reviews" => ["getReviewsByProjectId","addAComment","getVideoValidated"],
        "ressources" => ["show", "index", "store", "update", "destroy", "getTypes"],
        "notifications" => ["index", "store", "show", "update", "destroy"]
    ],
    "video_team" => [
        "users" => ["show", "index", "roles", "image", "password","reservations"],
        "projects" => ["getCaptionUrl","show", "index","stepsGet","addLink"],
        "teams" => ["show"],
        "rooms" => ["show", "index","available","showByProject"],
        "video-reviews" => ["getReviewsByProjectId","addAComment","getTemporaryUploadUrl","getVideoValidated"],
        "ressources" => ["show", "index", "store", "update", "destroy", "getTypes"],
        "notifications" => ["index", "store", "show", "update", "destroy"]
    ],
    "video_editor" => [
        "users" => ["show", "index", "roles", "image", "password","reservations"],
        "projects" => ["getCaptionUrl","show", "index"],
        "teams" => ["show"],
        "rooms" => ["show", "index","available","showByProject"],
        "video-reviews" => ["getReviewsByProjectId","store","destroy","addAComment","getTemporaryUploadUrl","getVideoValidated"],
        "ressources" => ["show", "index", "store", "update", "destroy", "getTypes"],
        "notifications" => ["index", "store", "show", "update", "destroy"]
    ],
    "transcription_team" => [
        "users" => ["show", "index", "roles", "image", "password","reservations"],
        "projects" => ["getCaptionUrl","show", "index","stepsGet"],
        "teams" => ["show"],
        "rooms" => ["show", "index","available","showByProject"],
        "video-reviews" => ["addAComment","getVideoValidated"],
        "ressources" => ["show", "index", "store", "update", "destroy", "getTypes"],
        "transcriptions" => ["index", "store", "destroy"],
        "notifications" => ["index", "store", "show", "update", "destroy"]
    ],
    "traduction_team" => [
        "users" => ["show", "index", "roles", "image", "password","reservations"],
        "projects" => ["getCaptionUrl","show", "index","stepsGet"],
        "teams" => ["show"],
        "rooms" => ["show", "index","available","showByProject"],
        "video-reviews" => ["addAComment","getVideoValidated"],
        "ressources" => ["show", "index", "store", "update", "destroy", "getTypes"],
        "notifications" => ["index", "store", "show", "update", "destroy"]
    ],
    "editorial_team" => [
        "users" => ["show", "index", "roles", "image", "password","reservations"],
        "projects" => ["getCaptionUrl","show", "index","stepsGet"],
        "teams" => ["show"],
        "rooms" => ["show", "index","available","showByProject"],
        "video-reviews" => ["addAComment","getVideoValidated"],
        "ressources" => ["show", "index", "store", "update", "destroy", "getTypes"],
        "notifications" => ["index", "store", "show", "update", "destroy"]
    ],
];
