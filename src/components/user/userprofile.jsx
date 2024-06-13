import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import UserNavbar from '../usernavbar/usernavbar';
import { useNavigate } from 'react-router-dom'; 
import Footer from '../Footer/Footer';

const ProfileContainer = styled.div`
  background: linear-gradient(45deg, #c487c4 0%, #b5afe3 100%);
  padding: 2rem;
  border-radius: 8px;
  max-width: 400px;
  margin: 3rem auto; /* Center the container */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */

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
  color: #333;
`;

const EditButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #6c43ad; 
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
            <InfoText><b>Name:</b> {member.user.first_name} {member.user.last_name}</InfoText>
            <InfoText><b>Email:</b> {member.user.email}</InfoText>
            <InfoText><b>Phone:</b> {member.number}</InfoText>
            {/* Display other member fields */}
            <EditButton onClick={handleEditProfile}>Edit Profile</EditButton>
          </MemberInfo>
        )}
      </ProfileContainer>
       <br></br>
        <Footer/>
    </div>
  );
};


export default Profile;
