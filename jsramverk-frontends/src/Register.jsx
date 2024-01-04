import React, { useState } from "react";
import { Link } from "react-router-dom";
import { config } from './Constants';

const URL = config.url;
let messageDiv;
let message;

const Register = () => {

    const url = `${URL}/register`;


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);

    const handleEmail = (e) => {
        setEmail(e.target.value);
    };

    const handlePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit  = (e) => {
        e.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        };

        fetch(url, requestOptions)
        .then((result)=> result.json())
        .then((data) => {
            document.getElementsByClassName('registerForm')[0].reset();
            if (data.data) {
                console.log(data.data)
                setSubmitted(true);
                message = data.data.message;
            } else if (data.errors) {
                setError(true);
                console.log(data.errors.title)
                message = data.errors.title;
            }
        })
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
            messageDiv = <div className="messages">{errorMessage()}{successMessage()}</div>;
        }

    return (
            <div>
                {messageDiv}
                <h1>Register</h1>
                <p>Register a new account or <Link to="/login">sign in</Link></p>
                <p><b>When you register, you will get an API key. You need this key to sign in, so write it down.</b></p>
                <form className="registerForm">
                    <label htmlFor="email">Email:</label>
                    <input onChange={handleEmail} type="text" id="email"></input>
                    <label htmlFor="password">Password:</label>
                    <input onChange={handlePassword} type="password" id="password"></input>
                    <button onClick={handleSubmit} className="registerBtn">Register</button>
                </form>
            </div>
        );
    }
    export default Register;
