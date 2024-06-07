import React from 'react';
import { Link } from 'react-router-dom';
import './adminhome.css';
import AdminNavbar from '../adminnavbar/adminnavbar';
import gallery_1 from '../Assets/gallery-1.png'
import gallery_2 from '../Assets/LO2.png'
import gallery_3 from '../Assets/LO4.png'


function ADMINHome() {
  return (
    <div>
      <AdminNavbar />
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
              <Link to="/borrrow_admin">
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
