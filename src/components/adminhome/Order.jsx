import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminNavbar from '../adminnavbar/adminnavbar'; 
import Footer from '../Footer/Footer';



const Order = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchData = async () => {
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

    fetchData();
  }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');

        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/order_data/', {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setOrders(response.data.orders);
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
       
       <AdminNavbar pendingCount={pendingCount} />

        <div className="container">
            <h2 className="text-center text-dark mt-4 text-uppercase">Order Details</h2>
            <div className="table-responsive mt-4">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Customer Name</th>
                            <th>Title</th>
                            <th>Quantity</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => (
                            <tr key={order.id}>
                                <td>{index + 1}</td>
                                <td>{order.user.first_name} {order.user.last_name}</td>
                                <td>{order.book.book}</td>
                                <td>{order.quantity}</td>
                                <td>{order.user.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        <br></br>
        <Footer/>
        </div>
    );
};

export default Order;
