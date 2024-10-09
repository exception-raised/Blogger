const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, './.env') })

app.use(cors());
app.use(express.json());

console.log(process.env.TOKEN_SECRET)

function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '21600s' });
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt); 
    return { salt, hashedPassword };
}

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

app.post("/api/createNewUser", async(req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const { salt, hashedPassword } = await hashPassword(password);
        
        const new_user = await pool.query(
            "INSERT INTO users (username, email, password, salt) VALUES($1, $2, $3, $4) RETURNING *",
            [username, email, hashedPassword, salt]
        );

        res.json({ email: email, password: password });
    } catch (err) {
        next(err);
    }
});

app.post("/api/login", async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "User not found" });
        }

        const user = result.rows[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);        

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = generateAccessToken({ email: user.email }); 
        res.json({ token, name: user.username, id: user.id }); 
    } catch (error) {
        next(error);
    }
});

app.get("/api/users/:id", async (req, res, next) => {
    const userId = req.params.id;

    try {
        const result = await pool.query("SELECT username, created_at FROM users WHERE id = $1", [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(result.rows[0]); 
    } catch (error) {
        next(error);
    }
});

app.get("/api/blogs/:id", async (req, res, next) => {
    const blogId = req.params.id;

    try {
        const result = await pool.query("SELECT * FROM blogs WHERE blog_id = $1", [blogId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.json(result.rows[0]); 
    } catch (error) {
        next(error);
    }
});

app.post("/api/blogs/new", authenticateToken, async(req, res, next) => {
    try {
        const { title, body, user_id } = req.body;
        const new_blog = await pool.query(
            "INSERT INTO blogs (title, body, likes, favorites, user_id) VALUES($1, $2, $3, $4, $5) RETURNING *",
            [title, body, 0, 0, user_id]
        );

        res.json(new_blog.rows[0]);
    } catch (err) {
        next(err);
    }
});

app.get("/api/blogs", async(req, res, next) => {
    try {
        const all_blogs = await pool.query("SELECT * FROM blogs");
        res.json(all_blogs.rows);
    } catch (err) {
        next(err);
    }
});

app.post('/api/blogs/:id/like', authenticateToken, async (req, res, next) => {
    const blogId = req.params.id;
    const userId = req.user.id;

    try {
        const result = await pool.query(
            'INSERT INTO likes (user_id, blog_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [userId, blogId]
        );

        if (result.rowCount === 0) {
            return res.status(400).json({ message: 'Blog already liked' });
        }

        await pool.query('UPDATE blogs SET likes = likes + 1 WHERE blog_id = $1', [blogId]);

        res.json({ message: 'Blog liked successfully' });
    } catch (error) {
        next(error);
    }
});

app.post('/api/blogs/:id/favorite', authenticateToken, async (req, res, next) => {
    const blogId = req.params.id;
    const userId = req.user.id;

    try {
        const result = await pool.query(
            'INSERT INTO favorites (user_id, blog_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [userId, blogId]
        );

        if (result.rowCount === 0) {
            return res.status(400).json({ message: 'Blog already favorited' });
        }

        await pool.query('UPDATE blogs SET favorites = favorites + 1 WHERE blog_id = $1', [blogId]);

        res.json({ message: 'Blog favorited successfully' });
    } catch (error) {
        next(error);
    }
});

app.get('/api/users/:id/likes', authenticateToken, async (req, res, next) => {
    const userId = req.params.id;

    try {
        const result = await pool.query(
            'SELECT blogs.* FROM blogs JOIN likes ON blogs.blog_id = likes.blog_id WHERE likes.user_id = $1',
            [userId]
        );

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
});

app.get('/api/users/:id/favorites', authenticateToken, async (req, res, next) => {
    const userId = req.params.id;

    try {
        const result = await pool.query(
            'SELECT blogs.* FROM blogs JOIN favorites ON blogs.blog_id = favorites.blog_id WHERE favorites.user_id = $1',
            [userId]
        );

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
});

app.get('/api/users/:id/blogs', authenticateToken, async (req, res, next) => {
    const userId = req.params.id;

    try {
        const result = await pool.query(
            'SELECT * FROM blogs WHERE user_id = $1',
            [userId]
        );

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
