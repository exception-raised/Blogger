import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import './style.css'; // Optional for additional styling

export default function ProfileView() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userResponse = await axios.get(`http://localhost:5000/api/users/${id}`);
                setUser(userResponse.data);
                
                const token = Cookies.get('token');

                const headers = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }

            } catch (error) {
                console.error('Error fetching user profile or recent activity:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [id]);

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    if (!user) {
        return <div className="text-center mt-5">User not found</div>;
    }

    return (
        <div className="container profile-container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-primary text-white text-center">
                            <h1>{user.username}'s Profile</h1>
                        </div>
                        <div className="card-body text-center">
                            <img
                                src={`https://api.dicebear.com/9.x/initials/svg?seed=${user.username}`} 
                                alt="User avatar"
                                className="rounded-circle img-thumbnail mb-3"
                                style={{ width: "100px", height: "100px" }}
                            />
                            <p>Joined on: {new Date(user.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
