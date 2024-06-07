import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import PropTypes from 'prop-types';
import UserNavbar from '../usernavbar/usernavbar';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';



function Usernotification() {
    
    const [userName, setUserName] = useState('');
    const [overdueBooks, setOverdueBooks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchUserInfo = async () => {
            try {
                const userInfoResponse = await axios.get('http://localhost:8000/api/user-info/', {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setUserName(userInfoResponse.data.first_name);
            } catch (error) {
                console.error('There was an error fetching user information!', error);
                navigate('/login');
            }
        };

       

       
        const fetchOverdueBooks = async () => {
            try {
                const overdueBooksResponse = await axios.get('http://localhost:8000/overdue_booksUser/', {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setOverdueBooks(overdueBooksResponse.data);
                console.log(overdueBooksResponse.data)
            } catch (error) {
                console.error('There was an error fetching overdue books!', error);
            }
        };

        fetchUserInfo();
       
        fetchOverdueBooks();
    }, [navigate]);

    return (
        <div>
            <UserNavbar />
            <div className="container mt-5">
                <h1 className="text-center mb-4">Welcome, {userName}!</h1>

                {/* Overdue Books Alert */}
                {overdueBooks.length > 0 && (
                    <Alert severity="error" className="mt-5">
                        <AlertTitle>Overdue Books</AlertTitle>
                        <ul>
                            {overdueBooks.map(book => (
                                <li key={book.id}>
                                    Your book "{book.book.title}" is overdue. Please return it as soon as possible.
                                </li>
                            ))}
                        </ul>
                    </Alert>
                )}
</div>
        </div>
    );
}

export default Usernotification;