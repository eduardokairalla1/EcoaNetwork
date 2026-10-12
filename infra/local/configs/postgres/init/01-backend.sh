#!/bin/sh
# Creates the backend's role and database.
set -eu

psql -v ON_ERROR_STOP=1 \
     -v password="$BACKEND_DB_PASSWORD" \
     --username "$POSTGRES_USER" --dbname postgres <<'SQL'
CREATE ROLE backend LOGIN PASSWORD :'password';
CREATE DATABASE ecoa_backend OWNER backend;
REVOKE CONNECT ON DATABASE ecoa_backend FROM PUBLIC;
SQL
