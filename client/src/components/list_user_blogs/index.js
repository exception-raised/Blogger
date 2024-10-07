
import axios from 'axios';
import React from 'react';

async function GetBlogs() {
   const response = await axios.get("http://localhost:5000/blogs");

   return response.data;
}


export default function ListUserBlogs() {
    const [blogs, setBlogs] = React.useState([]);

    React.useEffect(() => {
        async function fetchBlogs() {
            try {
                const blogsData = await GetBlogs();
                setBlogs(blogsData);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        }
        fetchBlogs();
    }, []);

    return (
        <>
            <h1>User Blogs</h1>
            <ul>
                {blogs.map(blog => (
                    <li key={blog.id}>{blog.title}</li> 
                ))}
            </ul>
        </>
    );
}