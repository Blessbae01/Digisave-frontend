import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // To redirect user after signup

const SignupPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const { fullName, email, phoneNumber, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const { data } = await axios.post('https://digisave-backend.onrender.com/api/users/signup', formData);

            // This code works perfectly with the new structure
            setMessage(data.message);

            // Redirect to login page on successful registration
            if (data.success) {
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (err) {
            // This also works perfectly with the new error structure
            setMessage(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div>
            <h2>Create an Account</h2>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="Full Name" name="fullName" value={fullName} onChange={onChange} required />
                <input type="email" placeholder="Email Address" name="email" value={email} onChange={onChange} required />
                <input type="text" placeholder="Phone Number" name="phoneNumber" value={phoneNumber} onChange={onChange} required />
                <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} required />
                <button type="submit">Create Account</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default SignupPage;