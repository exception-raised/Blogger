import axios from 'axios';
import { createContext, useContext, useMemo } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import React from 'react';

const UserContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [cookies, setCookies, removeCookie] = useCookies();
    const [userId, setUserId] = React.useState(null);

    const login = async ({ email, password }) => {
        const res = await axios.post('http://localhost:5000/api/login', {
            email: email,
            password: password
        });

        setCookies('token', res.data.token);
        setCookies('name', res.data.name);
        setUserId(res.data.id); 


        navigate('/');
    };

    const logout = () => {
        removeCookie('token');
        removeCookie('name');
        setUserId(null);
        navigate('/');
    };

    const value = useMemo(
        () => ({
            cookies,
            login,
            logout,
            userId
        }),
        [cookies]
    );

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
};

export const useAuth = () => {
    return useContext(UserContext)
};
