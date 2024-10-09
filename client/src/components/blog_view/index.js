import axios from 'axios';
import React, { useEffect, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";
import Cookies from 'js-cookie'; 
import "../shared/markdown_editor.css";
import { useParams } from 'react-router-dom';

export default function BlogDetail() {
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const token = Cookies.get('token');
                const response = await axios.get(`http://localhost:5000/api/blogs/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBlog(response.data);
            } catch (error) {
                console.error("Error fetching the blog:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!blog) {
        return <div>No blog found.</div>;
    }

    async function onFavorite() {
        try {
            const token = Cookies.get('token');
            const result = await axios.post(`http://localhost:5000/api/blogs/${blog.blog_id}/favorite`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            console.log(result.data); // Log the response data

            // Update the favorites count
            setBlog(prev => ({
                ...prev,
                favorites: prev.favorites + 1,
            }));
        } catch (err) {
            console.error(err.response ? err.response.data : err.message); // Log error details
        }
    }

    async function onLike() {
        try {
            const token = Cookies.get('token');
            const result = await axios.post(`http://localhost:5000/api/blogs/${blog.blog_id}/like`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            console.log(result.data); // Log the response data

            // Update the likes count
            setBlog(prev => ({
                ...prev,
                likes: prev.likes + 1,
            }));
        } catch (err) {
            console.error(err.response ? err.response.data : err.message); // Log error details
        }
    }

    return (
        <div className="blog-detail-container">
            <h1>{blog.title}</h1>
            <div className="author-info">
                <p>Author: {blog.user_id}</p>
            </div>
            <MDEditor
                height={500}
                preview="preview"
                previewOptions={{
                    rehypePlugins: [[rehypeSanitize]],
                }}
                value={blog.body} // Display the blog content
                onChange={() => {}} // Disable editing
            />
            <div className="blog-actions">
                <button className="btn btn-primary" onClick={onLike}>Like <span>{blog.likes}</span></button>
                <button className="btn btn-secondary" onClick={onFavorite}>Favorite <span>{blog.favorites}</span></button>
            </div>
        </div>
    );
}
