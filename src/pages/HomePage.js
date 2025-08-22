import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Modal from '../components/Modal'; // Import the Modal component

const HomePage = () => {
    // --- State Variables ---
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true); // State to manage loading UI
    const [isModalOpen, setIsModalOpen] = useState(false); // State for managing the modal
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [formData, setFormData] = useState({ chosenNumber: '', accountDetails: '' }); // State for the join form
    
    const navigate = useNavigate();

    const handleSelectGroup = (groupId) => {
        // Navigate to the specific group page
        navigate(`/groups/${groupId}`);
    };

    // yes Effect to fetch groups when the component loads
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                // 'data' is now the full response: { success, message, data }
                const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/groups`);

                // THE FIX: Check for success and get the array from data.data
                if (data.success && Array.isArray(data.data)) {
                    setGroups(data.data);
                } else {
                    // If not successful or data is not an array, set to empty
                    setGroups([]);
                }
            } catch (error) {
                console.error('Could not fetch groups', error);
                setGroups([]); // Also set to empty array on error
            } finally {
                // Stop loading display, whether it succeeded or failed
                setLoading(false);
            }
        };
        fetchGroups();
    }, []);

    // --- Event Handlers ---

    // Logout handler
    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    // Opens the modal when "Join" is clicked
    const handleJoinClick = (group) => {
        setSelectedGroup(group);
        setIsModalOpen(true);
    };

    // Closes the modal and resets the form
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedGroup(null);
        setFormData({ chosenNumber: '', accountDetails: '' }); // Reset form
    };

    // Updates form data state on input change
    const handleFormChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Submits the join request
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!selectedGroup) return;

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}` }
            };
            // The response from this POST will also have the new structure
            const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/groups/${selectedGroup._id}/join`, formData, config);
            
            // The success message is at data.message
            alert(data.message);
            handleCloseModal();
        } catch (err) {
            alert(err.response?.data?.message || 'Error sending join request');
            console.error(err);
        }
    };

    return (
        <div>
            {/* Header section with welcome message and logout */}
            <button onClick={logoutHandler} style={{ float: 'right' }}>Logout</button>
            <h2>Welcome! Find or Create a Group</h2>
            <Link to="/create-group">
                <button>+ Create New Esusu Group</button>
            </Link>
            <hr />
            <h3>Available Groups</h3>

            {/* Display a loading message while fetching */}
            {loading && <p>Loading groups...</p>}

            {/* Display a message if loading is done and no groups are found */}
            {!loading && groups.length === 0 && <p>No groups found. Why not create one?</p>}

            <div className="group-list">
                {/* Only map if groups exists and is a non-empty array */}
                {!loading && groups && groups.map(group => (
                    <div key={group._id} style={{ border: '1px solid black', padding: '10px', margin: '10px' }}>
                        <h4>{group.groupName}</h4>
                        <p>Contribution Amount: ₦{group.contributionAmount}</p>
                        
                        <p>Members: {(group.members || []).length} / {group.numberOfMembers}</p>
                        
                        <p>Admin: {group.admin ? group.admin.fullName : 'N/A'}</p>
                        <button onClick={() => handleJoinClick(group)}>Join</button>
                        <button onClick={() => handleSelectGroup(group._id)} style={{ marginLeft: '10px' }}>
                            Select
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal for the Join Group Form */}
            <Modal show={isModalOpen} onClose={handleCloseModal}>
                <h2>Join '{selectedGroup?.groupName}'</h2>
                <p>Please fill out the form below to request to join.</p>
                <form onSubmit={handleFormSubmit}>
                    <input
                        type="number"
                        placeholder="Choose a Payout Number"
                        name="chosenNumber"
                        value={formData.chosenNumber}
                        onChange={handleFormChange}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Your Bank Account Number"
                        name="accountDetails"
                        value={formData.accountDetails}
                        onChange={handleFormChange}
                        required
                    />
                    <button type="submit">Send Request</button>
                </form>
            </Modal>
        </div>
    );
};

export default HomePage;