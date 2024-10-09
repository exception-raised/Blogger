import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';


export default function HomePage() {
    const [blogs, setBlogs] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/blogs');
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

    return (
        <div>

        {/* Hero Section */}
        <section className="bg-light py-5 text-center">
            <div className="container">
            <h2>Welcome to Blogger</h2>
            <p className="lead">Discover interesting articles and stories.</p>
            <a href="#recent-posts" className="btn btn-primary">Read Latest Posts</a>
            </div>
        </section>

        
        <section id="recent-posts" className="py-5">
                <div className="container">
                    <h3 className="mb-4">Recent Posts</h3>
                    <div className="row">
                        {loading ? (
                            <div className="text-center">Loading...</div>
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
        <footer className="bg-dark text-white text-center py-3">
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
      <div className="card h-100">
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>
          <a href={`/post/${id}`} className="btn btn-primary">Read More</a>
        </div>
      </div>
    </div>
  );
}
