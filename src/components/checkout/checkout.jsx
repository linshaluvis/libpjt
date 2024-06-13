import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './checkout.css';
import UserNavbar from '../usernavbar/usernavbar';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer/Footer';


const Checkout = () => {
  const baseURL = 'http://127.0.0.1:8000';
  const token = localStorage.getItem('token');
  const navigate = useNavigate();


  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    state: '',
    zip: ''
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expirationDate: '',
    cvv: ''
  });
  const [orderSummary, setOrderSummary] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (token) {
        try {
          const response = await axios.get(`${baseURL}/api/cart-items/`, {
            headers: {
              'Authorization': `Token ${token}`
            }
          });
          setCartItems(response.data.items);
          setTotalPrice(response.data.total_price);
        } catch (error) {
          console.error('Error fetching cart items:', error);
        }
      } else {
        console.error('No token found');
      }
    };

    fetchCartItems();
  }, [baseURL, token]);

  const handleInputChange = (e, setState) => {
    const { name, value } = e.target;
    setState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCheckout = async () => {
    setIsSubmitting(true);
    try {
      const orderData = {
        cartItems,
        shippingInfo,
        paymentInfo
      };
      const response = await axios.post(`${baseURL}/checkout/`, orderData, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      if (response.data.status === 'success') {
        const successResponse = await axios.post(`${baseURL}/checkout_success/`, {}, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        setOrderSummary(successResponse.data);
        alert('Order placed successfully!');
        navigate('/checkoutsuccess');
      }
    } catch (error) {
      console.error('Error processing checkout:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <UserNavbar />
      <div className="checkout text-uppercase">
        <h1>Checkout</h1>
        
        <div className="order-summary">
          <h2>Order Summary</h2>
          <ul>
            {cartItems.map(item => (
              <li key={item.id}>{item.book.name} - Quantity: {item.quantity}</li>
            ))}
          </ul>
          <p>Total Price: ${totalPrice.toFixed(2)}</p>
        </div>
        
        <div className="shipping-info">
          <h2>Shipping Information</h2>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={shippingInfo.address}
            onChange={(e) => handleInputChange(e, setShippingInfo)}
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={shippingInfo.city}
            onChange={(e) => handleInputChange(e, setShippingInfo)}
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={shippingInfo.state}
            onChange={(e) => handleInputChange(e, setShippingInfo)}
          />
          <input
            type="text"
            name="zip"
            placeholder="Zip Code"
            value={shippingInfo.zip}
            onChange={(e) => handleInputChange(e, setShippingInfo)}
          />
        </div>
        
        <div className="payment-info">
          <h2>Payment Information</h2>
          <input
            type="text"
            name="cardNumber"
            placeholder="Card Number"
            value={paymentInfo.cardNumber}
            onChange={(e) => handleInputChange(e, setPaymentInfo)}
          />
          <input
            type="text"
            name="expirationDate"
            placeholder="Expiration Date (MM/YY)"
            value={paymentInfo.expirationDate}
            onChange={(e) => handleInputChange(e, setPaymentInfo)}
          />
          <input
            type="text"
            name="cvv"
            placeholder="CVV"
            value={paymentInfo.cvv}
            onChange={(e) => handleInputChange(e, setPaymentInfo)}
          />
        </div>
        
        <button onClick={handleCheckout} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Place Order'}
        </button>
        
        {orderSummary.user_orders && (
          <div className="order-confirmation">
            <h2>Order Confirmation</h2>
            <p>Thank you for your order!</p>
            {orderSummary.user_orders.map(order => (
              <div key={order.id}>
                <p>Book: {order.book}</p>
                <p>Quantity: {order.quantity}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <br></br>
        <Footer/>
    </div>
  );
};

export default Checkout;
