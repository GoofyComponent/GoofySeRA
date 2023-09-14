FROM php:8.1-apache
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



RUN docker-php-ext-install pdo zip mbstring exif pcntl bcmath gd pdo_mysql mysqli
RUN  curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && composer install --no-dev --optimize-autoloader --no-interaction \
    && chown -R www-data:www-data /var/www/html \
    && a2enmod rewrite

# ImageMagick module not available with this PHP installation.
RUN apt-get update && apt-get install -y \
    libmagickwand-dev --no-install-recommends \
    && pecl install imagick \
    && docker-php-ext-enable imagick

RUN apt-get update && apt-get install -y \
    libicu-dev \
    && docker-php-ext-configure intl \
    && docker-php-ext-install intl

RUN apt-get update && apt-get install -y \
    libxslt-dev \
    && docker-php-ext-install xsl

#The index.php file is the entry point of the application. And he is in the public folder.
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

RUN curl https://dl.min.io/client/mc/release/linux-amd64/mc \
  --create-dirs \
  -o $HOME/minio-binaries/mc && \
  chmod +x $HOME/minio-binaries/mc && \
  export PATH=$PATH:$HOME/minio-binaries/

# RUN usermod -u 1000 www-data && groupmod -g 1000 www-data
RUN usermod -u 1000 www-data && groupmod -g 1000 www-data
RUN chown -R www-data:www-data /var/www/html
RUN chown -R 1000:1000 /var/www/html && chmod -R 755 /var/www/html && chown -R 1000:1000 /root && chmod -R 755 /root
RUN mkdir -p /var/www/.mc && chown -R 1000:1000 /var/www/.mc && chmod -R 755 /var/www/.mc


CMD ["apache2-foreground"]
