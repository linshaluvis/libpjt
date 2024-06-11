import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminNavbar from '../adminnavbar/adminnavbar';

const Borrow = () => {
    const [borrows, setBorrows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pendingCount, setPendingCount] = useState(0);

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

    useEffect(() => {
        const fetchBorrows = async () => {
            try {
                const response = await axios.get('http://localhost:8000/borrow_admin/');
                setBorrows(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.response?.data?.error || 'An error occurred');
                setLoading(false);
            }
        };

        fetchBorrows();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <AdminNavbar pendingCount={pendingCount} />
            <div className="container">
                <h2 className="text-center mt-4 text-uppercase">Rent Details</h2>
                <div className="table-responsive mt-4">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Customer Name</th>
                                <th>Title</th>
                                <th>Borrow Date</th>
                                <th>Due Date</th>
                                <th>Email</th>
                                <th>Returned</th>
                                <th>Fine</th>
                            </tr>
                        </thead>
                        <tbody>
                            {borrows.map((borrow, index) => (
                                <tr key={borrow.id}>
                                    <td>{index + 1}</td>
                                    <td>{borrow.user.first_name}</td>
                                    <td>{borrow.book.book}</td>
                                    <td>{borrow.borrow_date}</td>
                                    <td>{borrow.return_date}</td>
                                    <td>{borrow.user.email}</td>
                                    <td>{borrow.returned ? 'Yes' : 'No'}</td>
                                    <td>{borrow.fine}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Borrow;
