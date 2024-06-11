import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './add_category.css';
import AdminNavbar from '../adminnavbar/adminnavbar'; 


function AddCategory() {
  const [pendingCount, setPendingCount] = useState(0);
  const [error, setError] = useState(null);
  const [categoryName, setCategoryName] = useState('');
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

  if (error) {
    return <div className="error-message">{error}</div>;
  }


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
       
       <AdminNavbar pendingCount={pendingCount} />
  
    <div className="add-category-container">
      <h2 className='text-uppercase'>Add New Category</h2>
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
