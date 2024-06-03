import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './add_category.css';
import AdminNavbar from '../adminnavbar/adminnavbar'; 


function AddCategory() {
  const [categoryName, setCategoryName] = useState('');
  const navigate = useNavigate();

  const handleCategoryChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:8000/create_category/', {
        category_name: categoryName,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.status === 201) {
        alert('Category created successfully');
        navigate('/showbook');  // Redirect to the admin panel or any other page
      }
    } catch (err) {
      console.error('Error creating category:', err);
      alert('Failed to create category');
    }
  };

  return (
    <div>
       
    <AdminNavbar/>
  
    <div className="add-category-container">
      <h2>Add New Category</h2>
      <form onSubmit={handleCategorySubmit}>
        <div>
          <label htmlFor="categoryName">Category Name:</label>
          <input
            type="text"
            id="categoryName"
            value={categoryName}
            onChange={handleCategoryChange}
          />
        </div>
        <button type="submit">Add Category</button>
      </form>
    </div>


</div>
  );
}
export default AddCategory;
