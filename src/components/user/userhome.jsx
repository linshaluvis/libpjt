import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faShoppingBag, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './userhome.css';
import UserNavbar from '../usernavbar/usernavbar';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';

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
            <div className="container mt-5">
                <h1 className="text-center mb-4">Welcome, {userName}!</h1>

                {/* Overdue Books Alert */}
                {overdueBooks.length > 0 && (
                    <Alert severity="error" className="mt-5">
                        <AlertTitle>Overdue Books</AlertTitle>
                        <ul>
                            {overdueBooks.map(book => (
                                <li key={book.id}>
                                    Your book "{book.book.title}" is overdue. Please return it as soon as possible.
                                </li>
                            ))}
                        </ul>
                    </Alert>
                )}

                <h2 className="text-center mt-5">Books</h2>

                <Grid container spacing={2} className="mt-3">
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
                                    <div className="book-stock">Stock: {book.stock}</div>
                                    <div className="book-status">
                                        {book.stock > 0 ? <p>Status: Available</p> : <p>Status: Out of Stock</p>}
                                    </div>
                                    <div className="button-container mt-3">
                                        <Button variant="contained" color="primary" onClick={() => handleBuyBook(book.id)}>
                                            <FontAwesomeIcon icon={faShoppingCart} />  Cart
                                        </Button>
                                        <Button variant="contained" color="secondary" className="mx-2" onClick={() => handleBorrowBook(book.id)}>
                                            <FontAwesomeIcon icon={faShoppingBag} /> Rent
                                        </Button>
                                        <Button variant="contained" color="success" onClick={() => handleBuyBook(book.id)}>
                                            <FontAwesomeIcon icon={faDollarSign} /> Buy
                                        </Button>
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
