import React, { useState } from 'react';
import axios from 'axios';
import UserNavbar from '../usernavbar/usernavbar';
import './changepassword.css';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import Footer from '../Footer/Footer';



const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const baseURL = 'http://127.0.0.1:8000';
    const token = localStorage.getItem('token');
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await axios.post(`${baseURL}/change_password/`, {
                current_password: currentPassword,
                password: newPassword,
                confirm_password: confirmPassword
            }, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            if (response.data.status === 'success') {
                setMessage(response.data.message);
                Toast.fire({
                    icon: "success",
                    title: `${response.data.message}`,
                  });
                navigate('/login'); 
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
        }
    };
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });

    return (
        <div>
            <UserNavbar />
            <div className="change-password-container">
               
                {error && <div className="error">{error}</div>}
                {message && <div className="message">{message}</div>}
                <form onSubmit={handleSubmit} className="form-container">
                <h2 className='text-uppercase text-center'>Change Password</h2>
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
                            title="Must contain at least one number and one uppercase and lowercase letter and one special characters, and at least 6 or more characters"
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label>Confirm New Password</label>
                        <input 
                            type="password" 
                            title="Must contain at least one number and one uppercase and lowercase letter and one special characters, and at least 6 or more characters"
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit">Change Password</button>
                </form>
            </div>
             <br></br>
        <Footer/>
        </div>
    );
};

export default ChangePassword;
