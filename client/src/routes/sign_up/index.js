import axios from 'axios';
import React from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../hooks/auth';


async function HandleSignUp(authData) {
    const response = await axios.post("http://localhost:5000/api/createNewUser", authData);
    console.log(response.data);
    return response.data;
}

export default function SignUpView() {
    const [authData, setAuthData] = React.useState({}); 
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await HandleSignUp(authData);
            const {username, email, password} = response; 
            login({email, password});
        } catch (err) {
            console.error(err.message);
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
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <input placeholder="username" type="text" name="username" onChange={handleChange}></input>
                <br/>
                <input placeholder="email" type="text" name="email" onChange={handleChange}></input>
                <br/>
                <input placeholder="password" type="password" name="password" onChange={handleChange}></input>
                <button type='submit'>Submit</button>
            </form>
        </>
    );
}
