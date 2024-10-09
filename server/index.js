const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();


app.use(cors());
app.use(express.json());



function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '21600s' });
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
  
      if (err) return res.sendStatus(403)
      req.user = user
  
      next()
    })
}

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt); 
    return { salt, hashedPassword };
}

app.post("/api/createNewUser", async(req, res) => {
    const token = generateAccessToken({ username: req.body.username });
    // res.json(token);
    const {username, email, password} = req.body;

    const { salt, hashedPassword } = await hashPassword(password);

    const new_user = await pool.query(
        "INSERT INTO users (username, email, password, salt) VALUES($1, $2, $3, $4) RETURNING *",
        [username, email, hashedPassword, salt]
    );

    res.json({email:email, password:password});

});

app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        // Check if user exists
        if (result.rows.length === 0) {
            console.log("INVALID USER");
            return res.status(401).json({ message: "User not found" });
        }

        const user = result.rows[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);        

        if (!isPasswordValid) {
            console.log("INVALID PASSWORD");
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = generateAccessToken({ email: user.email }); 

        res.json({ token, name: user.username, id: user.id }); 
        } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

app.get("/api/users/:id", async (req, res) => {
    const userId = req.params.id;

    try {
        const result = await pool.query("SELECT username, created_at FROM users WHERE id = $1", [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(result.rows[0]); // Return the user data
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: "Server error" });
    }
});

app.get("/api/blogs/:id", async (req, res) => {
    const blogId = req.params.id;

    try {
        const result = await pool.query("SELECT * FROM blogs WHERE blog_id = $1", [blogId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.json(result.rows[0]); // Return the user data
    } catch (error) {
        console.error('Error fetching Blog:', error);
        res.status(500).json({ message: "Server error" });
    }
});



app.post("/api/blogs/new", authenticateToken, async(req, res) => {
    try {
        const {title, body, user_id} = req.body;
        const new_blog = await pool.query(
            "INSERT INTO blogs (title, body, likes, favorites, user_id) VALUES($1, $2, $3, $4, $5) RETURNING *",
            [title, body, 0, 0, 9]
        );

        res.json(new_blog.rows[0]);

    } catch(err) {
        console.log(err.message);
    }
});

app.get("/api/blogs", async(req, res) => {
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
        const delete_blog = await pool.query("DELETE FROM blogs WHERE blog_id = $1", 
            [id]
        );
        res.json("Blog deleted successfully.");
    } catch (err) {
        console.error(err.message);
    }
})

app.post('/api/blogs/:id/like', authenticateToken, async (req, res) => {
    const blogId = req.params.id;
    const userId = 9; // req.user.id;

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
        console.error('Error liking blog:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// app.use((req, res, next) => {
//     req.user = { id: 1 }; // Example, replace with real authentication
//     next();
// });

app.post('/api/blogs/:id/favorite', authenticateToken, async (req, res) => {
    const blogId = req.params.id;
    const userId = 9; // req.user.id;

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
        console.error('Error favoriting blog:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/users/:id/likes', authenticateToken, async (req, res) => {
    const userId = req.params.id;

    try {
        const result = await pool.query(
            'SELECT blogs.* FROM blogs JOIN likes ON blogs.blog_id = likes.blog_id WHERE likes.user_id = $1',
            [userId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching liked blogs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/users/:id/favorites', authenticateToken, async (req, res) => {
    const userId = req.params.id;

    try {
        const result = await pool.query(
            'SELECT blogs.* FROM blogs JOIN favorites ON blogs.blog_id = favorites.blog_id WHERE favorites.user_id = $1',
            [userId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching favorited blogs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/users/:id/blogs', authenticateToken, async (req, res) => {
    const userId = req.params.id;

    try {
        const result = await pool.query(
            'SELECT * FROM blogs WHERE user_id = $1',
            [userId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching user blogs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(5000, () => {
    console.log("started");
})