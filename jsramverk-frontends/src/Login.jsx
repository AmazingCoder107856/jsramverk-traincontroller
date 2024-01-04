import React, { useState } from "react";
import { Link } from "react-router-dom";
import { config } from './Constants';

const URL = config.url;
const url = `${URL}/login`;
let messageDiv;
let message;

async function loginUser(credentials) {
    return fetch(`${url}`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
    },
        body: JSON.stringify(credentials)
    })
    .then(data => data.json())
}

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [apiKey, setApiKey] = useState('');

    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);

    const handleEmail = (e) => {
        setEmail(e.target.value);
    };

    const handlePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleApiKey = (e) => {
        setApiKey(e.target.value);
    };


    const handleSubmit  = async (e) => {
        e.preventDefault();

        const data = await loginUser({
            email:  email,
            password: password,
            api_key: apiKey
        });

        document.getElementsByClassName('loginForm')[0].reset();

        if (data.data) {
            setSubmitted(true);
            message = data.data.message;
            sessionStorage.setItem('token', data.data.token);
            sessionStorage.setItem('apikey', apiKey);
        } else if (data.errors) {
            setError(true);
            console.log(data.errors.title)
            message = data.errors.title;
        }
    }

    const successMessage = () => {
        return (
            <div
                className="success"
                style={{
                    display: submitted ? '' : 'none',
                }}>
                <p>{message}</p>
            </div>
        );
    };

    const errorMessage = () => {
        return (
            <div
                className="error"
                style={{
                    display: error ? '' : 'none',
                }}>
                <p>{message}</p>
            </div>
        );
    };

    if (error === true || submitted === true) {
        if (message === "User logged in") {
            messageDiv = <div className="messages">
            {successMessage()} <Link to="/" className="frontLink">Go to front page</Link>
            </div>;
        } else {
            messageDiv = <div className="messages">
            {errorMessage()}
            {successMessage()}
            </div>;
        }
    }

    return (
            <div>
                {messageDiv}
                <h1>Login</h1>
                <p>Please sign in</p>
                <form className="loginForm">
                    <label htmlFor="email">Email:</label>
                    <input onChange={handleEmail} type="text" id="email"></input>
                    <label htmlFor="password">Password:</label>
                    <input onChange={handlePassword} type="password" id="password"></input>
                    <label htmlFor="password">API Key:</label>
                    <input onChange={handleApiKey} type="text" id="api_key"></input>
                    <Link to="/register" className="frontLink">Register</Link><button onClick={handleSubmit} className="loginBtn">Sign in</button>
                </form>
            </div>
        );
    }
    export default Login;
