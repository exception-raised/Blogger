const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json());

app.post("/blogs", async(req, res) => {
    try {
        const {blog_id, title, likes, favorites, user_id} = req.body;
        const new_blog = await pool.query(
            "INSERT INTO blogs (title, likes, favorites, user_id) VALUES($1, $2, $3, $4) RETURNING *",
            [title, likes, favorites, user_id]
        );

        res.json(new_blog.rows[0]);

    } catch(err) {
        console.log(err.message);
    }
});

app.get("/blogs", async(req, res) => {
    try {
        const all_blogs = await pool.query("SELECT * FROM blogs");
        res.json(all_blogs.rows);
    }catch(err) {
        console.error(err.message);
    }
});

app.get("/blogs/:id", async(req, res) =>{ 
    try {
        const {id} = req.params;
        const blog = await pool.query("SELECT * FROM blogs WHERE blog_id = $1", [id]);
        res.json(blog.rows[0]);
    } catch(err) {
        console.error(err.message);
    }
});

app.put("/blogs/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const {title, likes, favorites, user_id} = req.body;
        const update_blog = await pool.query("UPDATE blogs SET title = $1, likes = $2, favorites = $3, user_id = $4 WHERE blog_id = $5",
            [title, likes, favorites, user_id, id]
        );
        res.json(update_blog.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.delete("/blogs/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const delete_blog = await pool.query("DELETE FROM blogs WHERE blog_id = $1", [id]);
        res.json("Blog deleted successfully.");
    } catch (err) {
        console.error(err.message);
    }
})

app.listen(5000, () => {
    console.log("started");
})