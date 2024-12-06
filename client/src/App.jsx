import React, { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import BookList from './components/BookList'; // Import your BookPage component

const App = () => {
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [authMode, setAuthMode] = useState('signup'); // 'signup' or 'login'
    const [errorMessage, setErrorMessage] = useState('');
    const [token, setToken] = useState(''); // Token to determine if user is logged in
    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (authMode === 'signup') {
            axios.post('http://localhost:5000/api/auth/signup', form)
                .then((response) => {
                    alert('Signup successful');
                    setForm({ username: '', email: '', password: '' });
                    setToken(response.data.token); // Store token after successful signup
                    navigate('/books'); // Redirect to /books page
                })
                .catch((error) => setErrorMessage(error.response.data.error || 'Signup failed'));
        } else if (authMode === 'login') {
            axios.post('http://localhost:5000/api/auth/login', form)
                .then((response) => {
                    setToken(response.data.token); // Store token after successful login
                    alert('Login successful');
                    navigate('/books'); // Redirect to /books page
                })
                .catch((error) => setErrorMessage(error.response.data.error || 'Login failed'));
        }
    };

    // If the user is logged in, show the BookList, otherwise show the login/signup form
    if (token) {
        return <BookList token={token} />;
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1>{authMode === 'signup' ? 'Sign Up' : 'Login'}</h1>

            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            <form onSubmit={handleSubmit}>
                {authMode === 'signup' && (
                    <div>
                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Username"
                        />
                    </div>
                )}
                <div>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Password"
                    />
                </div>
                <button type="submit">{authMode === 'signup' ? 'Sign Up' : 'Login'}</button>
            </form>

            <button onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}>
                {authMode === 'signup' ? 'Already have an account? Login' : 'Create an account'}
            </button>
        </div>
    );
};

export default App;