import axios from 'axios';
import React from 'react';
import { useAuth } from '../../hooks/auth';
import "./style.css";
import api from '../../api';


async function HandleSignUp(authData) {
    const response = await api.post("/api/createNewUser", authData);
    return response.data;
}

export default function SignUpView() {
    const [authData, setAuthData] = React.useState({});
    const { login } = useAuth();
    const [validated, setValidated] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity()) {
            try {
                const response = await HandleSignUp(authData);
                login({ email: response.email, password: response.password });
            } catch (err) {
                console.error(err.message);
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
            <h1 className="text-center">Sign Up</h1>
            <div className="container d-flex justify-content-center align-items-center custom-vh-100" style={{ marginTop: 10 + 'em' }}>
                <form onSubmit={handleSubmit} className={`d-flex flex-column align-items-center w-75 needs-validation ${validated ? 'was-validated' : ''}`} noValidate>
                    <div className="mb-3">
                        <input
                            className="form-control form_input"
                            placeholder="Username"
                            type="text"
                            name="username"
                            onChange={handleChange}
                            required
                        />
                        <div className="invalid-feedback">
                            Please provide a valid username.
                        </div>
                    </div>
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
                        <span className="text-white">Already a member? </span>
                        <a href="/sign-up" className="text-decoration-none text-white">Login</a>
                    </div>
                </form>
            </div>
        </>
    );
}
