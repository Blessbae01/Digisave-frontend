import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateGroupPage = () => {
    const [formData, setFormData] = useState({
        groupName: '',
        numberOfMembers: '',
        contributionAmount: '',
        startingDate: ''
    });
    const navigate = useNavigate();

    const { groupName, numberOfMembers, contributionAmount, startingDate } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            // 1. Get user info from local storage
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            // Add a check to make sure userInfo exists
            if (!userInfo || !userInfo.token) {
                alert('You must be logged in to create a group.');
                navigate('/login');
                return;
            }
            const token = userInfo.token;

            // 2. Set up the headers to include the token
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };

            // 3. yes Send the request and get the new response structure
            const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/groups`, formData, config);
            
            // THE FIX: Use the message from the API response
            alert(data.message);
            
            navigate('/home');
        } catch (err) {
            // This error handling is now more robust
            alert(err.response?.data?.message || 'Error creating group.');
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Create a New Esusu Group</h2>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="Group Name" name="groupName" value={groupName} onChange={onChange} required />
                <input type="number" placeholder="Number of Members" name="numberOfMembers" value={numberOfMembers} onChange={onChange} required />
                <input type="number" placeholder="Fixed Contribution Amount" name="contributionAmount" value={contributionAmount} onChange={onChange} required />
                <input type="date" placeholder="Starting Date" name="startingDate" value={startingDate} onChange={onChange} required />
                <button type="submit">Create Group</button>
            </form>
        </div>
    );
};

export default CreateGroupPage;