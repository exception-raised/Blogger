import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie'; 


export default function ManageBlogsView() {
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!blogs.length) {
        return <div>No blogs found.</div>;
    }

    return (
        <div className="manage-blogs-container">
            <h1>Your Blogs</h1>
            <ul className="list-group">
                {blogs.map(blog => (
                    <li key={blog.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{blog.title}</strong>
                            <p>{blog.body.slice(0, 100)}...</p>
                        </div>
                        <Link to={`/blogs/${blog.blog_id}/edit`} className="btn btn-primary">Edit</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
