import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Cart.css';
import UserNavbar from '../usernavbar/usernavbar';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const baseURL = 'http://127.0.0.1:8000';
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      // Fetch cart items from Django API
      axios.get(`${baseURL}/api/cart-items/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      })
      .then(response => {
        setCartItems(response.data.items);
        setTotalPrice(response.data.total_price);
      })
      .catch(error => {
        console.error('Error fetching cart items:', error);
      });
    } else {
      console.error('No token found');
    }
  }, [baseURL, token]);

  const handlePostRequest = (url) => {
    if (token) {
      axios.post(url, {}, {
        headers: {
          'Authorization': `Token ${token}`,
        }
      })
      .then(response => {
        setCartItems(response.data.items);
        setTotalPrice(response.data.total_price);
      })
      .catch(error => {
        console.error(`Error processing request: ${url}`, error);
      });
    } else {
      console.error('No token found');
    }
  };

  const increaseQuantity = async (bookId) => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/cart/increase/${bookId}/`);
      console.log('Quantity increased:', response.data);
    } catch (error) {
      console.error('Error processing request:', error);
    }
  };

  const decreaseQuantity = async (bookId) => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/cart/decrease/${bookId}/`);
      console.log('Quantity decreased:', response.data);
    } catch (error) {
      console.error('Error processing request:', error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/cart/remove/${itemId}/`);
      console.log('Item removed:', response.data);
    } catch (error) {
      console.error('Error processing request:', error);
    }
  };

  return (
    <div>
      <UserNavbar />
      <div className="container">
        <h1>Your Shopping Cart</h1>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Item</th>
              <th>Book name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map(item => (
              <tr key={item.id}>
                <td>
                  {item.book.image && (
                    <img src={`${baseURL}${item.book.image}`} alt={item.book.name} style={{ width: 100, height: 100 }} />
                  )}
                </td>
                <td>{item.book.name}</td>
                <td>₹{item.book.price.toFixed(2)}</td>
                <td>
                  <div className="quantity">
                    <button onClick={() => increaseQuantity(item.book.id)}>+</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => decreaseQuantity(item.book.id)}>-</button>
                  </div>
                </td>
                <td><button className="rem-button btn-danger" onClick={() => handleRemoveItem(item.id)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <h5>Total: ₹{totalPrice.toFixed(2)}</h5>
        <button onClick={() => window.location.href = '/checkout'} className="btn w-25 btn-success">Checkout</button>
      </div>
    </div>
  );
};

export default Cart;
