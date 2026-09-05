#!/bin/bash

# Script to generate a secure .env file with randomized passwords

ENV_FILE=".env"

if [ -f "$ENV_FILE" ]; then
    echo "Warning: $ENV_FILE already exists. Do you want to overwrite it? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo "Aborting."
        exit 1
    fi
fi

echo "Generating secure passwords..."

# Generate 32-character random passwords
DB_PASSWORD=$(LC_ALL=C tr -dc 'a-zA-Z0-9' </dev/urandom | head -c 32)
DB_USER="nextcloud_user_$(LC_ALL=C tr -dc 'a-z0-9' </dev/urandom | head -c 6)"

echo "POSTGRES_USER=$DB_USER" > "$ENV_FILE"
echo "POSTGRES_PASSWORD=$DB_PASSWORD" >> "$ENV_FILE"

echo ".env file generated successfully."
echo "Keep this file secure as it contains the database credentials."
