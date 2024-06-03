import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const EditContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  background-color: #28a745;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #218838;
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

        setMember(response.data.member);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('first_name', member.user.first_name);
    formData.append('last_name', member.user.last_name);
    formData.append('email', member.user.email);
    formData.append('number', member.number);

    if (profileImage) {
      formData.append('mebimage', profileImage);
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put('http://127.0.0.1:8000/profile/', formData, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/profile'); // Navigate back to the profile page after saving
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
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
        <Input type="text" name="first_name" value={member.user?.first_name || ''} onChange={handleChange} />

        <Label>Last Name</Label>
        <Input type="text" name="last_name" value={member.user?.last_name || ''} onChange={handleChange} />

        <Label>Email</Label>
        <Input type="email" name="email" value={member.user?.email || ''} onChange={handleChange} />

        <Label>Phone Number</Label>
        <Input type="text" name="number" value={member.number || ''} onChange={handleChange} />

        <Label>Profile Image</Label>
        <Input type="file" name="mebimage" onChange={handleFileChange} />

        <SaveButton type="submit">Save</SaveButton>
      </Form>
    </EditContainer>
  );
};

export default EditProfile;
