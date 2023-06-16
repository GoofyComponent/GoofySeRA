#!/bin/bash

if [ ! -f ./.env ]
then
    cp .env.example .env
    cp sera-back/.env.example sera-back/.env
    chmod 755 sera-back/.env
    chmod 755 .env
    echo ".env file is not found, copying from .env.example, waiting for 5 seconds..."
    sleep 5
    if [ ! -f ./.env ]
    then
        echo "copying .env failed, please copy .env.example to .env manually"
        exit ;
    fi
fi

echo "--- composer install ---"
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v $(pwd)/sera-back:/opt \
    -w /opt \
    laravelsail/php81-composer \
    composer install --ignore-platform-reqs

#Check if sail folder exists
if [ ! -d ./sera-back/vendor/laravel/sail ]
then
    echo "sail folder not found, exiting..."
    exit ;
fi

echo "--- launch docker container ---"
./sera-back/vendor/laravel/sail/bin/sail up -d --build --force-recreate

echo "--- migrate database  ---"
if [ "${1}" = "reset" ]
then
    ./sera-back/vendor/laravel/sail/bin/sail artisan migrate:refresh --seed
else
    ./sera-back/vendor/laravel/sail/bin/sail artisan migrate
fi

echo "--- done ---"
echo "visit http://localhost"