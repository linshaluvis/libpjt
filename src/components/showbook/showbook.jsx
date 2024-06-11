import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './showbook.css'; 
import AdminNavbar from '../adminnavbar/adminnavbar'; 
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';

const Showbook = () => {
    const [categories, setCategories] = useState([]);
    const [books, setBooks] = useState([]);
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

    useEffect(() => {
        axios.get('http://localhost:8000/api/categories/')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the categories!', error);
            });

        axios.get('http://localhost:8000/api/books/')
            .then(response => {
                setBooks(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the books!', error);
            });
    }, []);

    const handleDelete = (id, bookName) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete "${bookName}"?`);
        if (confirmDelete) {
            axios.delete(`http://localhost:8000/api/books/${id}/`)
                .then(response => {
                    setBooks(books.filter(book => book.id !== id));
                })
                .catch(error => {
                    console.error('Error deleting book:', error);
                });
        }
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div>
            <AdminNavbar pendingCount={pendingCount} />
            <div className="content-container">
                <h1 className='text-center'>Books</h1>
                <Grid container spacing={3}>
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
                                    <div className="book-author">Stock: {book.stock}</div>
                                    <div className="book-category">Category: {book.category.category_name}</div>
                                    <div className="button-container">
                                        <Link to={`/edit/${book.id}`} className="edit-button">Edit</Link>
                                        <button onClick={() => handleDelete(book.id, book.book)} className="delete-button">Delete</button>
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

export default Showbook;
