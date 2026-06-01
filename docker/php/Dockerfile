FROM php:8.3-fpm-alpine

RUN apk add --no-cache \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev \
    git \
    supervisor \
    nodejs \
    npm

RUN docker-php-ext-install pdo pdo_pgsql pgsql gd xml pcntl posix

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

CMD ["php-fpm"]
