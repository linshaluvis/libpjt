import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminNavbar from '../adminnavbar/adminnavbar';
import Footer from '../Footer/Footer';
import './borrowadmin.css';

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
                console.log(response.data);
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
    const paidStyle = { color: 'green' };
    const notPaidStyle = { color: 'red' };
    return (
        <div>
            <AdminNavbar pendingCount={pendingCount} />
            <div className="container-borrow">
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
                                <th>Paid</th>
                            </tr>
                        </thead>
                        <tbody>
                            {borrows.map((borrow, index) => (
                                <tr key={borrow.id}>
                                    <td>{index + 1}</td>
                                    <td>{borrow.user.first_name} {borrow.user.last_name}</td>
                                    <td>{borrow.book.book}</td>
                                    <td>{borrow.borrow_date}</td>
                                    <td>{borrow.return_date}</td>
                                    <td>{borrow.user.email}</td>
                                    <td>{borrow.returned}</td>
                                    <td>{borrow.fine}</td>
                                    <td style={borrow.fine > 0 ? notPaidStyle : paidStyle}>
                                        {borrow.fine > 0 ? 'Not Paid' : 'Paid'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <br />
            <Footer />
        </div>
    );
}

export default Borrow;
