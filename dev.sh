#!/bin/bash

if [ ! -f ./.env ]
then
    echo ".env file is not found, please copy from .env.example"
    exit ;
fi

echo "--- composer install ---"
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v $(pwd):/opt \
    -w /opt \
    laravelsail/php80-composer:latest \
    composer install --ignore-platform-reqs

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