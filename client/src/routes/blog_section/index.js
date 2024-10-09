import React from 'react';
import { Link } from 'react-router-dom';

export default function BlogsSection() {
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h1 className="text-center mb-4">Blogs Section</h1>
                    <div className="card shadow-sm">
                        <div className="card-body text-center">
                            <Link to="/blogs/new" className="btn btn-primary btn-lg m-2">
                                Create New Blog
                            </Link>
                            <Link to="/blogs/manage" className="btn btn-warning btn-lg m-2">
                                Manage Existing Blogs
                            </Link>
                            <Link to="/blogs/browse" className="btn btn-success btn-lg m-2">
                                Browse Blogs
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
