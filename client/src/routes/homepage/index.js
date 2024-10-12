import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

export default function HomePage() {
    // @todo: modularize

    return (
        <div className='mb-4 header d-flex justify-content-center align-items-center'>


            <section className="py-5 text-center">
                <div className="container">
                    <h1 className='text-white'>Welcome to Blogger</h1>
                    <p className="lead text-white">Discover interesting articles and stories.</p>
                </div>
            </section>


            <footer className="bg-dark text-white text-center py-3 fixed-bottom border-top border-white" style={{height: 5.2 + 'em'}}>
                <div className="container">
                    <p>&copy; 2024 Blogger. All Rights Reserved.</p>
                    <a href="#" className="text-white mx-2">Privacy Policy</a>
                    <a href="#" className="text-white mx-2">Contact</a>
                </div>
            </footer>
        </div>
    );
}
