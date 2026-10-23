FROM php:8.3-cli-bookworm
RUN apt-get update && apt-get install -y --no-install-recommends libsqlite3-dev libonig-dev libxml2-dev unzip && docker-php-ext-install pdo_sqlite mbstring dom xml xmlwriter && rm -rf /var/lib/apt/lists/*
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
WORKDIR /app
COPY composer.json composer.lock ./
RUN --mount=type=secret,id=composer_ca if [ -f /run/secrets/composer_ca ]; then export COMPOSER_CAFILE=/run/secrets/composer_ca; fi; composer install --no-interaction --prefer-dist --no-scripts
COPY . .
RUN chmod -R a+rX /app && mkdir -p var/data && chown -R www-data:www-data var
USER www-data
ENV APP_ENV=prod APP_DEBUG=0 APP_SECRET=pawprice-local-demo
EXPOSE 8000
CMD ["sh", "-c", "php bin/console app:initialize && exec php -S 0.0.0.0:8000 -t public public/index.php"]
