import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const GroupPage = () => {
    const { id } = useParams(); // Gets the group ID from the URL (e.g., /groups/123)
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (!userInfo) { // Guard against user not being logged in
                    setLoading(false);
                    return;
                }
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                };
                // 'data' is now the full response: { success, message, data }
                const { data } = await axios.get(`https://digisave-backend.onrender.com/api/groups/${id}/requests`, config);
                
                // THE FIX: Check for success and get the array from data.data
                if (data.success && Array.isArray(data.data)) {
                    setRequests(data.data);
                } else {
                    setRequests([]);
                }
            } catch (error) {
                console.error('Could not fetch requests', error);
                // Optionally show an error message to the user
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [id]);

    const handleApprove = async (requestId) => {
        if (!window.confirm('Are you sure you want to approve this member?')) {
            return;
        }
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            };
            // The response from this PUT request will also have the new structure
            const { data } = await axios.put(`https://digisave-backend.onrender.com/api/groups/requests/${requestId}/approve`, {}, config);
            
            // Use the success message from the API
            alert(data.message);
            
            // Refresh the list by filtering out the approved request
            setRequests(prevRequests => prevRequests.filter(req => req._id !== requestId));
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to approve member.');
            console.error(error);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <h3>Pending Join Requests</h3>
            {requests.length > 0 ? (
                requests.map(req => (
                    <div key={req._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '5px' }}>
                        <p><strong>User:</strong> {req.user.fullName} ({req.user.email})</p>
                        <p><strong>Chosen Number:</strong> {req.chosenNumber}</p>
                        <p><strong>Account Details:</strong> {req.accountDetails}</p>
                        <button onClick={() => handleApprove(req._id)}>Approve</button>
                    </div>
                ))
            ) : (
                <p>No pending requests.</p>
            )}
        </div>
    );
};

export default GroupPage;