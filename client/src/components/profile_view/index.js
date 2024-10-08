import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function ProfileView() {
    const { id } = useParams(); // Get the user ID from the URL
    const [user, setUser] = useState(null); // State to hold user data
    const [loading, setLoading] = useState(true); // State to handle loading

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/users/${id}`);
                setUser(response.data); // Set user data
            } catch (error) {
                console.error('Error fetching user profile:', error);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchUserProfile();
    }, [id]); // Fetch user profile when component mounts or ID changes

    if (loading) {
        return <div>Loading...</div>; // Show loading message while fetching data
    }

    if (!user) {
        return <div>User not found</div>; // Handle case where user is not found
    }

    return (
        <div>
            <h1>{user.username}'s Profile</h1>
            <p>Email: {user.email}</p>
            <p>Joined: {new Date(user.created_at).toLocaleDateString()}</p>
            {/* Add more user details as needed */}
        </div>
    );
}
