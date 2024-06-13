import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../usernavbar/usernavbar';
import Footer from '../Footer/Footer';

const EditContainer = styled.div`
  background: linear-gradient(45deg, #c487c4 0%, #b5afe3 100%);
  padding: 2rem;
  border-radius: 8px;
  max-width: 400px;
  margin: 3rem auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Header = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 16px;
  color: #555;
  margin-bottom: 5px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SaveButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #6c43ad;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #2a023c;
  }
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 20px;
`;

const EditProfile = () => {
  const [member, setMember] = useState({
    first_name: '',
    last_name: '',
    email: '',
    number: '',
    mebimage: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const baseURL = 'http://127.0.0.1:8000';

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/profileapi/', {
          headers: {
            'Authorization': `Token ${token}`
          }
        });

        setMember({
          ...response.data.member,
          first_name: response.data.member.user.first_name,
          last_name: response.data.member.user.last_name,
          email: response.data.member.user.email,
        });
      } catch (error) {
        console.error('Error fetching member data:', error);
      }
    };

    fetchMemberData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember({
      ...member,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const validate = () => {
    const errors = {};
    if (!member.first_name.trim()) errors.first_name = 'First Name is required';
    if (!member.last_name.trim()) errors.last_name = 'Last Name is required';
    if (!member.email.trim()) errors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(member.email)) errors.email = 'Email is invalid';
    else if (!member.email.includes('.com')) errors.email = 'Email must contain .com';
    if (!String(member.number).trim()) errors.number = 'Phone Number is required';
    else if (!/^\d{10}$/.test(String(member.number).trim())) errors.number = 'Contact number must be 10 digits';
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append('first_name', member.first_name);
    formData.append('last_name', member.last_name);
    formData.append('email', member.email);
    formData.append('number', member.number);
    if (profileImage) {
      formData.append('mebimage', profileImage);
    }

    try {
      const token = localStorage.getItem('token');

      // Check if the email is being updated and exists for another user
      if (member.email !== member.user.email) {
        const emailExistsResponse = await axios.get(`http://127.0.0.1:8000/check-email-exists/?email=${member.email}`, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });

        if (emailExistsResponse.data.exists) {
          setErrors({
            ...errors,
            email: 'Email already exists'
          });
          return;
        }
      }

      await axios.put('http://127.0.0.1:8000/profile/', formData, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/Memberprofile'); // Navigate back to the profile page after saving
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div>
      <UserNavbar />
      <EditContainer>
        <Header>Edit Profile</Header>
        <Form onSubmit={handleSubmit}>
          {member.mebimage && (
            <ProfileImage 
              src={`${baseURL}${member.mebimage}`} 
              alt="Profile" 
              onError={(e) => { e.target.onerror = null; e.target.src = 'fallback-image-url'; }} 
            />
          )}
          <Label>First Name</Label>
          <Input 
            type="text" 
            name="first_name" 
            value={member.first_name || ''} 
            onChange={handleChange} 
          />
          {errors.first_name && <p style={{ color: 'red' }}>{errors.first_name}</p>}

          <Label>Last Name</Label>
          <Input 
            type="text" 
            name="last_name" 
            value={member.last_name || ''} 
            onChange={handleChange} 
          />
          {errors.last_name && <p style={{ color: 'red' }}>{errors.last_name}</p>}

          <Label>Email</Label>
          <Input 
            type="email" 
            name="email" 
            value={member.email || ''} 
            onChange={handleChange} 
          />
          {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}

          <Label>Phone Number</Label>
          <Input 
            type="text" 
            name="number" 
            value={member.number || ''} 
            onChange={handleChange} 
          />
          {errors.number && <p style={{ color: 'red' }}>{errors.number}</p>}

          <Label>Profile Image</Label>
          <Input type="file" name="mebimage" onChange={handleFileChange} />

          <SaveButton type="submit">Save</SaveButton>
        </Form>
      </EditContainer>
      <br />
      <Footer />
    </div>
  );
};

export default EditProfile;
