FROM php:8.2-apache
ARG WWWGROUP

WORKDIR /var/www/html

ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

COPY . /var/www/html

RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    curl \
    vim 
RUN docker-php-ext-install pdo pdo_pgsql pgsql zip mbstring exif pcntl bcmath gd 
RUN  curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && composer install --no-dev --optimize-autoloader --no-interaction \
    && chown -R www-data:www-data /var/www/html \
    && a2enmod rewrite

#The index.php file is the entry point of the application. And he is in the public folder.
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# RUN usermod -u 1000 www-data && groupmod -g 1000 www-data
RUN usermod -u 1000 www-data && groupmod -g 1000 www-data
RUN chown -R www-data:www-data /var/www/html/storage
RUN chown -R 1000:1000 /var/www/html && chmod -R 755 /var/www/html

# user is 1000 1000 php docker for all the files. Change the user to www-data
RUN chown -R www-data:www-data /var/www/html/storage
RUN chown -R 1000:1000 /var/www/html && chmod -R 755 /var/www/html


RUN php artisan key:generate
RUN php artisan cache:clear
RUN php artisan config:clear
RUN php artisan config:cache

CMD ["apache2-foreground"]