CREATE DATABASE bloggerdb;

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "username" varchar,
  "email" varchar UNIQUE NOT NULL,
  "password" varchar NOT NULL,
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

CREATE TABLE likes (
    user_id INT REFERENCES users(id),
    blog_id INT REFERENCES blogs(blog_id),
    liked_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, blog_id)
);

CREATE TABLE favorites (
    user_id INT REFERENCES users(id),
    blog_id INT REFERENCES blogs(blog_id),
    favorited_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, blog_id)
);