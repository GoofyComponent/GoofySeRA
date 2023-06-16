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


printf "Paths:\n"
printf "  - sera-back: %s\n" "$(pwd)/sera-back"
printf "  - sera-front: %s\n" "$(pwd)/sera-front"
printf "  - userid: %s\n" "$(id -u)"
printf "  - groupid: %s\n" "$(id -g)"

#Print a ls of the current directory
printf "Directory:\n"
ls -la

#print a ls of all subdirectories
printf "sera-back:\n"
ls -la sera-back
printf "sera-front:\n"
ls -la sera-front

#Find the path of the composer.json file
printf "composer.json:\n"
find . -name composer.json


echo "--- composer install ---"
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v $(pwd)/sera-back:/opt \
    -w /opt \
    laravelsail/php80-composer:latest \
    -c "ls -la && composer install --ignore-platform-reqs"

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