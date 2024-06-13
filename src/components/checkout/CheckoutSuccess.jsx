import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CheckoutSuccess.css';  
import UserNavbar from '../usernavbar/usernavbar';
import Footer from '../Footer/Footer';


const CheckoutSuccess = () => {
  return (
    <div>
      <UserNavbar />
    <div className="checkout-success">
      <h1 className='text-uppercase'>Order placed</h1>
      <p>Thank you for shopping</p>
      <button className="btn btn-primary w-50 continue-button">
        <Link to="/userhome" className="continue-link">
          Continue shopping
        </Link>
      </button>
    </div>
     <br></br>
        <Footer/>
    </div>
  );
};

export default CheckoutSuccess;
