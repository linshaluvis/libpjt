import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditBook.css'; // Ensure to import the CSS file
import Footer from '../Footer/Footer';
import AdminNavbar from '../adminnavbar/adminnavbar'; 


const EditBook = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        book: '',
        author: '',
        price: '',
        publisher_id: '',
        stock: '',
        category: '',
        image: null
    });
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8000/api/books/${id}/edit/`)
            .then(response => {
                const bookData = response.data.book;
                console.log(bookData)

                setFormData({
                    book: bookData.book,
                    author: bookData.author,
                    price: bookData.price,
                    publisher_id: bookData.publisher_id,
                    stock: bookData.stock,
                    category: bookData.category,  // assuming category is an object
                    image: bookData.image
                });
                setCategories(response.data.categories);
            })
            .catch(error => {
                console.error('There was an error fetching the book data!', error);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log( name, value)
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const handleImageChange = (e) => {
        console.log(e.target.files[0]); // Log the selected image file
        setFormData({
            ...formData,
            image: e.target.files[0]
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedData = new FormData();
        console.log(updatedData)
        updatedData.append('book', formData.book);
        updatedData.append('author', formData.author);
        updatedData.append('price', formData.price);
        updatedData.append('publisher_id', formData.publisher_id);
        updatedData.append('stock', formData.stock);
        updatedData.append('category', formData.category);
        if (formData.image) {
            updatedData.append('image', formData.image);
        }
        console.log([...updatedData.entries()]);

        axios.put(`http://localhost:8000/api/books/${id}/edit/`, updatedData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            console.log('Book updated successfully!', response.data);
            navigate('/showbook'); // Redirect to book list or another page after successful update
        })
        .catch(error => {
            console.error('There was an error updating the book!', error);
        });
    };

    return (
        <div>
       
        <AdminNavbar/>
        <div className="edit-book-container">
            <h1>Edit Book</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input type="text" name="book" value={formData.book} onChange={handleChange} />
                </div>
                <div>
                    <label>Author:</label>
                    <input type="text" name="author" value={formData.author} onChange={handleChange} />
                </div>
                <div>
                    <label>Price:</label>
                    <input type="text" name="price" value={formData.price} onChange={handleChange} />
                </div>
                <div>
                    <label>Publisher ID:</label>
                    <input type="text" name="publisher_id" value={formData.publisher_id} onChange={handleChange} />
                </div>
                <div>
                    <label>Stock:</label>
                    <input type="text" name="stock" value={formData.stock} onChange={handleChange} />
                </div>
                <div>
                    <label>Category:</label>
                    <select name="category" value={formData.category} onChange={handleChange}>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.category_name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Image:</label>
                    <input type="file" name="image" onChange={handleImageChange} />
                    {formData.image && <img src={`http://localhost:8000${formData.image}`} alt={formData.book} width="100" />}
                </div>
                <button type="submit">Update Book</button>
            </form>
        </div>
        <br></br>
        <Footer/>
        </div>
    );
};

export default EditBook;
