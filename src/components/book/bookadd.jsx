import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './add_book.css'; 
import AdminNavbar from '../adminnavbar/adminnavbar';
import Footer from '../Footer/Footer';

function AddBook() {
  const [bookName, setBookName] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('');
  const [publisherId, setPublisherId] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

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
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/get_categories/');
        console.log(response.data)
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('book', bookName);
    formData.append('author', author);
    formData.append('price', price);
    formData.append('publisher_id', publisherId);
    formData.append('stock', stock);
    formData.append('image', image);
    formData.append('category', category);

    try {
      const res = await axios.post('http://127.0.0.1:8000/add_book/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(res.status)
      if (res.status === 201) {
        alert('Book added successfully');
        navigate('/showbook');  // Redirect to the admin panel or any other page
      }
    } catch (err) {
      console.error('Error adding book:', err);
      alert('Failed to add book');
    }
  };

  return (
    <div>
      <AdminNavbar pendingCount={pendingCount} />
      <div className="add-book-container">
        <h2 className='text-uppercase' >Add New Book</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div>
            <label htmlFor="bookName">Book Name:</label>
            <input
              type="text"
              id="bookName"
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="author">Author:</label>
            <input
              type="text"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="publisherId">Publisher ID:</label>
            <input
              type="number"
              id="publisherId"
              value={publisherId}
              onChange={(e) => setPublisherId(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="stock">Stock:</label>
            <input
              type="number"
              id="stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="image">Image:</label>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
            />
          </div>
          <div>
            <label htmlFor="category">Category:</label>
            <select id="category" value={category} onChange={handleCategoryChange}>
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit">Add Book</button>
        </form>
      </div>
      <br></br>
      <Footer/>
    </div>
  );
}

export default AddBook;
