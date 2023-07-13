#!/bin/bash

if [ ! -f ./.env ]
then
    cp .env.example .env
    cp sera-back/.env.example sera-back/.env
    cp sera-front/.env.example sera-front/.env
    chmod 755 ./sera-back/.env
    chmod 755 ./sera-front/.env
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
./sera-back/vendor/bin/sail up -d --build --force-recreate

./sera-back/vendor/bin/sail artisan key:generate

# On remove le cache de toutes les configurations, des routes, des api, etc.
./sera-back/vendor/bin/sail artisan config:clear
./sera-back/vendor/bin/sail artisan route:clear

#Storage link
./sera-back/vendor/bin/sail artisan storage:link

echo "--- wait for 10 seconds ---"
sleep 10

echo "--- migrate database  ---"
./sera-back/vendor/bin/sail artisan migrate:fresh --seed


echo "--- done ---"
echo "visit http://localhost"