import axios from 'axios';
import React from 'react';
import { useAuth } from '../../hooks/auth';
import api from '../../api';


async function HandleSignIn(authData) {
    const response = await api.post("api/login", authData);
    return response.data;
}


export default function LoginView() {
    const [authData, setAuthData] = React.useState({}); 
    const { login } = useAuth();
    const [validated, setValidated] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if(form.checkValidity()){
            try {
                const response = await HandleSignIn(authData);
                login({ email: authData.email, password: authData.password }); 
            } catch (err) {
                console.error("Error:", err.message);
            }
        }
        setValidated(true); 
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
            <h1 className="text-center">Sign In</h1>
            <div className="container d-flex justify-content-center align-items-center custom-vh-100" style={{ marginTop: 10 + 'em' }}>
                <form onSubmit={handleSubmit} className={`d-flex flex-column align-items-center w-75 needs-validation ${validated ? 'was-validated' : ''}`} noValidate>
                    <div className="mb-3">
                        <input
                            className="form-control form_input"
                            placeholder="Email"
                            type="email"
                            name="email"
                            onChange={handleChange}
                            required
                        />
                        <div className="invalid-feedback">
                            Please provide a valid email.
                        </div>
                    </div>
                    <div className="mb-3">
                        <input
                            className="form-control form_input"
                            placeholder="Password"
                            type="password"
                            name="password"
                            onChange={handleChange}
                            required
                        />
                        <div className="invalid-feedback">
                            Please provide a password.
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-100 form_input">Submit</button>
                    <div className="mt-3">
                        <span className="text-white">Don't have an account? </span>
                        <a href="/sign-up" className="text-decoration-none text-white">Sign Up</a>
                    </div>
                    </form>
            </div>
        </>
    );
}