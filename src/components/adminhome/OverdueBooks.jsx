import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminNavbar from '../adminnavbar/adminnavbar'; 


const OverdueBooks = () => {
    const [overdueBooks, setOverdueBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/overdue_books/', {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setOverdueBooks(response.data.overdue_books);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.response?.data?.error || 'An error occurred');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
       
        <AdminNavbar/>
        <div className="container">
            <h2 className="text-center text-uppercase text-dark mt-4">Overdue Members</h2>
            <div className="table-responsive mt-4">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Book Title</th>
                            <th>Borrow Date</th>
                            <th>Due Date</th>
                            <th>User</th>
                        </tr>
                    </thead>
                    <tbody>
                        {overdueBooks.map((borrow, index) => (
                            <tr key={index}>
                                <td>{borrow.book_title}</td>
                                <td>{borrow.borrow_date}</td>
                                <td>{borrow.return_date}</td>
                                <td>{borrow.user.first_name} {borrow.user.last_name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </div>
    );
};

export default OverdueBooks;