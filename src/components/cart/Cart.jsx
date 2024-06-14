import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Cart.css';
import UserNavbar from '../usernavbar/usernavbar';
import Button from '@mui/material/Button';
import Footer from '../Footer/Footer';
import { faShoppingCart, faShoppingBag, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const baseURL = 'http://127.0.0.1:8000';
  const token = localStorage.getItem('token');

  const fetchCartItems = async () => {
    if (token) {
      try {
        const response = await axios.get(`${baseURL}/api/cart-items/`, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        setCartItems(response.data.items || []);
        setTotalPrice(response.data.total_price || 0);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    } else {
      console.error('No token found');
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [token]);

  const increaseQuantity = async (bookId) => {
    if (token) {
      try {
        await axios.post(`${baseURL}/cart/increase/${bookId}/`, {}, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        fetchCartItems();
      } catch (error) {
        console.error('Error increasing quantity:', error);
      }
    } else {
      console.error('No token found');
    }
  };

  const decreaseQuantity = async (bookId) => {
    if (token) {
      try {
        await axios.post(`${baseURL}/cart/decrease/${bookId}/`, {}, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        fetchCartItems();
      } catch (error) {
        console.error('Error decreasing quantity:', error);
      }
    } else {
      console.error('No token found');
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (token) {
      try {
        const response = await axios.delete(`${baseURL}/api/cart/remove/${itemId}/`, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        setCartItems(response.data.items || []);
        setTotalPrice(response.data.total_price || 0);
        alert("item removed")

      } catch (error) {
        console.error('Error removing item:', error);
      }
    } else {
      console.error('No token found');
    }
  };

  return (
    <div>
      <UserNavbar />
      <div className="container-cart">
        <h1 className="text-center text-uppercase text-dark mt-4"><FontAwesomeIcon icon={faShoppingCart}/>Shopping Cart</h1>
        <div className="table-responsive mt-4">
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
              {cartItems.length > 0 ? (
                cartItems.map(item => (
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
                    <td>
                      <button className="rem-button btn-danger" onClick={() => handleRemoveItem(item.id)}>Remove</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className='text-center' colSpan="5">Your cart is empty</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <h5 className='text-center'>Total: ₹{totalPrice.toFixed(2)}</h5>
        <button className="checkout-button" onClick={() => window.location.href = '/checkout'}><FontAwesomeIcon icon={faShoppingBag} /> Checkout</button>
      </div>
      <br />
      <Footer />
    </div>
  );
};

export default Cart;
