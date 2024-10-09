import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import './style.css'

const BrowseBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const token = Cookies.get('token');
                const response = await axios.get('http://localhost:5000/api/blogs', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setBlogs(response.data);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const handleLike = async (blogId) => {
        try {
            await axios.post(`http://localhost:5000/api/blogs/${blogId}/like`);
        } catch (error) {
            console.error('Error liking the blog:', error);
        }
    };

    const handleFavorite = async (blogId) => {
        try {
            await axios.post(`http://localhost:5000/api/blogs/${blogId}/favorite`);
        } catch (error) {
            console.error('Error favoriting the blog:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="browse-blogs-container">
            <h1>Browse Blogs</h1>
            <div className="blog-list">
                {blogs.map(blog => (
                    <div key={blog.id} className="blog-card">
                        <h3>
                            <Link to={`/blogs/${blog.blog_id}`}>{blog.title}</Link>
                        </h3>
                        <p>By: {blog.authorName}</p>
                        <p>{blog.body.substring(0, 100)}...</p>
                        <button onClick={() => handleLike(blog.blog_id)} className="btn btn-light">
                            Like
                        </button>
                        <button onClick={() => handleFavorite(blog.blog_id)} className="btn btn-light">
                            Favorite
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BrowseBlogs;
