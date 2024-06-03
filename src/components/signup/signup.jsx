import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './signup.css'; // Import the CSS file for styling
import Loginnavbar from '../loginnavbar/loginnavbar'; 


function MemberReg() {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [img, setImg] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImg(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('user.first_name', fname);
    formData.append('user.last_name', lname);
    formData.append('user.username', username);
    formData.append('user.email', email);
    formData.append('user.password', password);
    formData.append('number', number);
    formData.append('mebimage', img);

    try {
      const res = await axios.post('http://127.0.0.1:8000/memberreg/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const token = res.data.token;  // Extract the token from the response
      localStorage.setItem('token', token);
      console.log(token);
      if (res.status === 201) {
        alert('Successfully registered, please wait for admin approval');
        navigate('/login');  // Redirect to the home page or any other page
      }
    } catch (err) {
      console.error('Error registering member:', err);
      alert('Failed to register member');
    }
  };

  return (
    <div className="Home">
    <Loginnavbar/>
     <br />
    <div className="member-reg-container">
      <h2>Register New Member</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label htmlFor="fname">First Name:</label>
          <input
            type="text"
            id="fname"
            value={fname}
            onChange={(e) => setFname(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="lname">Last Name:</label>
          <input
            type="text"
            id="lname"
            value={lname}
            onChange={(e) => setLname(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="number">Contact Number:</label>
          <input
            type="text"
            id="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="img">Profile Image:</label>
          <input
            type="file"
            id="img"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
    </div>
  );
}

export default MemberReg;
