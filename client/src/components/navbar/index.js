// Navbar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/auth';
import Cookies from 'js-cookie';

const Navbar = () => {
    const location = useLocation();
    const { logout, userId } = useAuth();

    const hideNavbar = location.pathname === '/login' || location.pathname === '/sign-up';

    if (hideNavbar) {
        return null; 
    }
    

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light border-bottom border-white h-5" data-bs-theme="dark" style={{height: 5 + 'em'}}>
            <div className="container">
                <Link className="navbar-brand" to="/">Blogger</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/blogs">Blogs</Link>
                        </li>
                        {Cookies.get('token') ? 
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" onClick={handleLogout}>Logout</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to={`/users/${userId}`}>Profile</Link>
                                </li>
                            </>
                        : 
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/sign-up">Sign Up</Link>
                                </li>
                            </>
                        }
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
