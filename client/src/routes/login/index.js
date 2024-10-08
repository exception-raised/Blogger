import axios from 'axios';
import React from 'react';
import { useAuth } from '../../hooks/auth';


async function HandleSignIn(authData) {
    const response = await axios.post("http://localhost:5000/api/login", authData);
    return response.data;
}

export default function LoginView() {
    const [authData, setAuthData] = React.useState({}); 
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await HandleSignIn(authData);
            const { username, email } = response; 
            login({ email: authData.email, password: authData.password }); 
        } catch (err) {
            console.error("Error:", err.message);
        }
    };
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAuthData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    return (
        <>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <input placeholder="email" type="text" name="email" onChange={handleChange}></input>
                <br/>
                <input placeholder="password" type="password" name="password" onChange={handleChange}></input>
                <button type='submit'>Submit</button>
            </form>
        </>
    );
}
