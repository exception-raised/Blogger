CREATE DATABASE bloggerdb;

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "username" varchar,
  "password" varchar,
  "created_at" timestamp
);

CREATE TABLE "blogs" (
  "blog_id" SERIAL PRIMARY KEY,
  "title" varchar,
  "body" varchar,
  "likes" integer,
  "favorites" integer,
  "user_id" integer
);
