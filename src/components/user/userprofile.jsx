import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import UserNavbar from '../usernavbar/usernavbar';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const ProfileContainer = styled.div`
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

const MemberInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const MemberImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 20px;
`;

const InfoText = styled.p`
  font-size: 16px;
  color: #555;
`;

const EditButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
  
  &:hover {
    background-color: #0056b3;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 24px;
  color: #333;
`;

const Profile = () => {
  const [member, setMember] = useState(null);
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log(token);

        const response = await axios.get('http://127.0.0.1:8000/profileapi/', {
          headers: {
            'Authorization': `Token ${token}`
          }
        });

        setMember(response.data.member);
        console.log(response.data.member);
        setBooks(response.data.books);
        setCategories(response.data.categories);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditProfile = () => {
    navigate('/edit-profile'); // Navigate to the edit profile page
  };

  if (loading) {
    return <LoadingContainer>Loading...</LoadingContainer>;
  }
  const baseURL = 'http://127.0.0.1:8000';

  return (
    <div>
      <UserNavbar />
      <ProfileContainer>
        <Header>Profile</Header>
        {member && (
          <MemberInfo>
            <MemberImage
              src={`${baseURL}${member.mebimage}`}
              alt="Member Image"
              onError={(e) => { e.target.onerror = null; e.target.src = 'fallback-image-url'; }}
            />
            <InfoText>Name: {member.user.first_name} {member.user.last_name}</InfoText>
            <InfoText>Email: {member.user.email}</InfoText>
            <InfoText>Phone: {member.number}</InfoText>
            {/* Display other member fields */}
            <EditButton onClick={handleEditProfile}>Edit Profile</EditButton>
          </MemberInfo>
        )}
      </ProfileContainer>
    </div>
  );
};


export default Profile;
