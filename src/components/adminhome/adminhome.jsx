import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './adminhome.css';
import AdminNavbar from '../adminnavbar/adminnavbar';
import gallery_1 from '../Assets/gallery-1.png';
import gallery_2 from '../Assets/LO2.png';
import gallery_3 from '../Assets/LO4.png';

function ADMINHome() {
  const [pendingCount, setPendingCount] = useState(0);
  const [error, setError] = useState(null);

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

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <AdminNavbar pendingCount={pendingCount} />
      <div className="container mt-5">
        <h1 className="text-center mb-4">WELCOME ADMIN</h1>
        <div className="row">
          <div className="col-md-6 col-lg-3 mb-3 mt-5">
            <div className="card h-100">
              <Link to="/memberdetails">
                <img className="card-img-top uniform-img" src={gallery_1} alt="Card image" />
              </Link>
              <div className="card-body">
                <h4 className="card-title">Members</h4>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3 mb-3 mt-5">
            <div className="card h-100">
              <Link to="/order_data">
                <img className="card-img-top uniform-img" src={gallery_2} alt="Card image" />
              </Link>
              <div className="card-body">
                <h4 className="card-title">Orders</h4>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3 mb-3 mt-5">
            <div className="card h-100">
              <Link to="/borrow_admin">
                <img className="card-img-top uniform-img" src={gallery_3} alt="Card image" />
              </Link>
              <div className="card-body">
                <h4 className="card-title">Rent details</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ADMINHome;
