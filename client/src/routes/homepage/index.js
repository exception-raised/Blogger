import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import api from "../../api.js";

export default function HomePage() {
    const [blogs, setBlogs] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await api.get('/api/blogs');
                console.log(response.data); // Check the structure of the response
                setBlogs(response.data);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            } finally {
                setLoading(false);
            }
        };
        

        fetchBlogs();
    }, []);

    const recentBlogs = blogs.slice(0, 6);
    // @todo: modularize

    return (
        <div>


        <section className="bg-dark py-5 text-center">
            <div className="container">
            <h2 className='text-white'>Welcome to Blogger</h2>
            <p className="lead text-white">Discover interesting articles and stories.</p>
            <a href="#recent-posts" className="btn btn-primary">Read Latest Posts</a>
            </div>

            
        </section>

        
        <section id="recent-posts" className="py-5 bg-dark">
                <div className="container">
                    <h3 className="mb-4 text-white">Recent Posts</h3>
                    <div className="row bg-dark">
                        {loading ? (
                            <div className="text-center bg-dark">Loading...</div>
                        ) : (
                            recentBlogs.map(blog => (
                                <PostCard 
                                    key={blog.blog_id} 
                                    title={blog.title} 
                                    description={blog.body.substring(0, 100) + '...'} 
                                    id={blog.blog_id} 
                                />
                            ))
                        )}
                    </div>
                </div>
            </section>


        {/* Footer */}
        <footer className="bg-dark text-white text-center py-3 fixed-bottom">
            <div className="container">
            <p>&copy; 2024 Blogger. All Rights Reserved.</p>
                <a href="#" className="text-white mx-2">Privacy Policy</a>
                <a href="#" className="text-white mx-2">Contact</a>
            </div>
        </footer>
        </div>
    );
}

function PostCard({ title, description, id }) {
  return (
    <div className="col-md-4 mb-3">
      <div className="card h-100 bg-dark">
        <div className="card-body">
          <h5 className="card-title text-white">{title}</h5>
          <p className="card-text text-white">{description}</p>
          <a href={`/post/${id}`} className="btn btn-primary">Read More</a>
        </div>
      </div>
    </div>
  );
}
