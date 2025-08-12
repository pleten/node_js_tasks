-- DDL: базові таблиці
CREATE SCHEMA IF NOT EXISTS naive_orm;
SET search_path TO naive_orm;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- uuid looks like this: 123e4567-e89b-12d3-a456-426614174000
CREATE TABLE users (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   first_name VARCHAR(100) NOT NULL,
   last_name VARCHAR(100) NOT NULL,
   email VARCHAR(100) NOT NULL,
   role VARCHAR(100) NOT NULL,
   age INTEGER
);