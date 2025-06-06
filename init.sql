-- Создаем базу данных homework_db, если её нет
CREATE DATABASE homework_db;

-- Создаем базу данных judge0, если её нет
CREATE DATABASE judge0;

\c homework_db;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create schemas
CREATE SCHEMA IF NOT EXISTS public;

-- Set search path
SET search_path TO public;

-- Даем права (хотя postgres и так имеет полный доступ)
GRANT ALL PRIVILEGES ON DATABASE judge0 TO postgres;