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
    const [overdueBooks, setOverdueBooks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchUserInfo = async () => {
            try {
                const userInfoResponse = await axios.get('http://localhost:8000/api/user-info/', {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setUserName(userInfoResponse.data.first_name);
            } catch (error) {
                console.error('There was an error fetching user information!', error);
                navigate('/login');
            }
        };

        const fetchCategories = async () => {
            try {
                const categoriesResponse = await axios.get('http://localhost:8000/api/categories/', {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setCategories(categoriesResponse.data);
            } catch (error) {
                console.error('There was an error fetching the categories!', error);
            }
        };

        const fetchBooks = async () => {
            try {
                const booksResponse = await axios.get('http://localhost:8000/api/books/', {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setBooks(booksResponse.data);
            } catch (error) {
                console.error('There was an error fetching the books!', error);
            }
        };

        const fetchOverdueBooks = async () => {
            try {
                const overdueBooksResponse = await axios.get('http://localhost:8000/overdue_booksUser/', {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setOverdueBooks(overdueBooksResponse.data);
                console.log(overdueBooksResponse.data)
            } catch (error) {
                console.error('There was an error fetching overdue books!', error);
            }
        };

        fetchUserInfo();
        fetchCategories();
        fetchBooks();
        fetchOverdueBooks();
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
                navigate('/cart'); // Redirect to cart page
            }
        } catch (error) {
            if (error.response) {
                alert(error.response.data.error || 'An error occurred');
            } else {
                alert('An error occurred');
            }
        }
    };

    const handleBorrowBook = async (bookId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(`http://localhost:8000/borrow_book/${bookId}/`, {}, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            if (response.status === 201) {
                alert('Book borrowed successfully!');
                navigate('/borrow'); // Redirect to borrow page
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
                <h1>Welcome, {userName}!</h1>

                {/* Overdue Books Alert */}
                {overdueBooks.length > 0 && (
                    <div className="alert alert-danger alert-dismissible fade show mt-5" role="alert">
                        <h4 className="alert-heading">Overdue Books</h4>
                        <ul>
                            {overdueBooks.map(book => (
                                <li key={book.id}>
                                    Your book "{book.book_title}" is overdue. Please return it as soon as possible.
                                </li>
                            ))}
                        </ul>
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                )}

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
                                        <button onClick={() => handleBuyBook(book.id)} className="cart-button">
                                            <FontAwesomeIcon icon={faShoppingCart} /> CART
                                        </button>
                                        <button onClick={() => handleBorrowBook(book.id)} className="rent-button">
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
