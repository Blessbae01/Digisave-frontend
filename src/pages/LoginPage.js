import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        const config = { headers: { 'Content-Type': 'application/json' } };
        try {
            //yes  'data' is now the full response object: { success, message, data }
            const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/users/login`, formData, config);
            // First, check if the login was successful
            if (data.success) {
                // THE FIX: Store the nested user object from data.data
                localStorage.setItem('userInfo', JSON.stringify(data.data));

                // Use the success message from the API response
                setMessage(data.message);
                
                // Redirect to home page
                navigate('/home');
            }
        } catch (err) {
            // The error message structure is the same, so this is correct
            setMessage(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div>
            <h2>Welcome Back!</h2>
            <form onSubmit={onSubmit}>
                <input type="email" placeholder="Email Address" name="email" value={email} onChange={onChange} required />
                <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} required />
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default LoginPage;