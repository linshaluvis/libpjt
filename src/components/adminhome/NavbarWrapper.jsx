// src/components/NavbarWrapper.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../adminnavbar/adminnavbar';

const NavbarWrapper = ({ children }) => {
    const [pendingCount, setPendingCount] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        const fetchPendingCount = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/get_user_status/', {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setPendingCount(response.data.pending_count || 0);
            } catch (error) {
                setError('An error occurred while fetching data');
            }
        };

        fetchPendingCount();
    }, []);

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div>
            <AdminNavbar pendingCount={pendingCount} />
            <div className="content">
                {children}
            </div>
        </div>
    );
};

export default NavbarWrapper;
