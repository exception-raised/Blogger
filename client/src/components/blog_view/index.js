import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function BlogView() {
    const { id } = useParams(); 
    const [blog, setBlog] = useState(null); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/blogs/${id}`);
                setBlog(response.data); 
            } catch (error) {
                console.error('Error fetching blog:', error);
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
        return <div>Blog not found</div>; 
    }

    return (
        <div>
            <h1>{blog.title}</h1>
            <p>{blog.body}</p>
            <h4>{blog.favorites}</h4>
            <h4>{blog.likes}</h4>
            
            {/* <p>Joined: {new Date(user.created_at).toLocaleDateString()}</p> */}
        </div>
    );
}
