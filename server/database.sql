CREATE DATABASE bloggerdb;

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "username" varchar,
  "email" varchar,
  "password" varchar,
  "created_at" timestamp DEFAULT NOW(),
  "salt" varchar
);

CREATE TABLE "blogs" (
  "blog_id" SERIAL PRIMARY KEY,
  "title" varchar,
  "body" varchar,
  "likes" integer,
  "favorites" integer,
  "user_id" integer
);
