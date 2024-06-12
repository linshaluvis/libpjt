import React from 'react'
import './Hero.css'
import dark_arrow from '../Assets/dark-arrow.png'
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const handleExploreMoreClick = () => {
    navigate('/login');
  };
  return (
    <div className='hero-container'>
      <div className="hero-text">
      <h1>The Library Management System</h1>
  <p>Designed to efficiently handle the borrowing, returning, and cataloging of books, ensuring a seamless experience for both librarians and patrons.</p>
  
        <button className='herobtn btn' onClick={handleExploreMoreClick}>Explore more <img src={dark_arrow} alt="" /></button>
      </div>
    </div>
    
  )
}

export default Hero
