import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faShoppingBag, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './userhome.css';
import UserNavbar from '../usernavbar/usernavbar';
import axios from 'axios';
import Grid from '@mui/material/Grid';

function UserHome() {
    const [categories, setCategories] = useState([]);
    const [books, setBooks] = useState([]);
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // Fetch user's information
        axios.get('http://localhost:8000/api/user-info/', {
            headers: {
                'Authorization': `Token ${token}`
            }
        })
        .then(response => {
            setUserName(response.data.first_name);
        })
        .catch(error => {
            console.error('There was an error fetching user information!', error);
            navigate('/login');
        });

        // Fetch categories
        axios.get('http://localhost:8000/api/categories/', {
            headers: {
                'Authorization': `Token ${token}`
            }
        })
        .then(response => {
            setCategories(response.data);
        })
        .catch(error => {
            console.error('There was an error fetching the categories!', error);
        });

        // Fetch books
        axios.get('http://localhost:8000/api/books/', {
            headers: {
                'Authorization': `Token ${token}`
            }
        })
        .then(response => {
            setBooks(response.data);
        })
        .catch(error => {
            console.error('There was an error fetching the books!', error);
        });
    }, [navigate]);

    const handleBuyBook = async (bookId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(`http://localhost:8000/buy_book/${bookId}/`, {}, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            if (response.status === 201) {
                alert('Book added to cart successfully!');
                navigate('/Showmember'); // Redirect to cart page
            }
        } catch (error) {
            if (error.response) {
                alert(error.response.data.error || 'An error occurred');
            } else {
                alert('An error occurred');
            }
        }
    };

    return (
        <div>
            <UserNavbar />
            <div>
                <h1>Welcome, {userName}!</h1> {/* Display welcome message with user's name */}

                <h1>Categories</h1>
                <ul>
                    {categories.map(category => (
                        <li key={category.id}>{category.category_name}</li>
                    ))}
                </ul>

                <h1 className='text-center'>Books</h1>

                <Grid container spacing={2} direction="row">
                    {books.map(book => (
                        <Grid item xs={12} sm={6} md={4} key={book.id}>
                            <div className="book-item">
                                <div className="book-image">
                                    {book.image && <img src={book.image} alt={book.book} />}
                                </div>
                                <div className="book-details">
                                    <div className="book-title">{book.book}</div>
                                    <div className="book-author">by {book.author}</div>
                                    <div className="book-price">₹ {book.price}</div>
                                    <div className="book-category">Category: {book.category.category_name}</div>
                                    <div className="book-category">Stock: {book.stock}</div>

                                    <br />
                                    <div className="button-container">
                                        <button className="cart-button">
                                            <FontAwesomeIcon icon={faShoppingCart} /> CART
                                        </button>
                                        <button className="rent-button">
                                            <FontAwesomeIcon icon={faShoppingBag} /> RENT
                                        </button>
                                        <button onClick={() => handleBuyBook(book.id)} className="buy-button">
                                            <FontAwesomeIcon icon={faDollarSign} /> BUY
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Grid>
                    ))}
                </Grid>
            </div>
        </div>
    );
}

export default UserHome;
