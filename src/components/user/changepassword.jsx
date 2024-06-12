import React, { useState } from 'react';
import axios from 'axios';
import UserNavbar from '../usernavbar/usernavbar';
import './changepassword.css';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await axios.post('/change_password/', {
                current_password: currentPassword,
                password: newPassword,
                confirm_password: confirmPassword
            });

            if (response.data.status === 'success') {
                setMessage(response.data.message);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError(err.response.data.message || 'An error occurred.');
        }
    };

    return (
        <div>
            <UserNavbar />
            <div className="change-password-container">
                <h2>Change Password</h2>
                {error && <div className="error">{error}</div>}
                {message && <div className="message">{message}</div>}
                <form onSubmit={handleSubmit} className="form-container">
                    <div>
                        <label>Current Password</label>
                        <input 
                            type="password" 
                            value={currentPassword} 
                            onChange={(e) => setCurrentPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label>New Password</label>
                        <input 
                            type="password" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label>Confirm New Password</label>
                        <input 
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit">Change Password</button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
