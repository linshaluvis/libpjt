import React, { useEffect, useState } from 'react'
import './Navbar.css'
import logo from '../Assets/I2.png'
import menu_icon from '../Assets/menu-icon.png'
import { Link } from 'react-scroll';
import { useNavigate } from 'react-router-dom';



const Navbar = () => {

    const [sticky, setSticky] = useState(false);

    useEffect(()=>{
        window.addEventListener('scroll', ()=>{
            window.scrollY > 50 ? setSticky(true) : setSticky(false);
        })
    },[]);


    const [mobileMenu, setMobileMenu] = useState(false);
    const toggleMenu = ()=>{
      mobileMenu ? setMobileMenu(false) : setMobileMenu(true);
    }
    const navigate = useNavigate();

  const handleExploreMoreClick = () => {
    navigate('/login');
  };

  return (
    <nav className={`container ${sticky? 'dark-nav' : ''}`}>
      <img src={logo} alt="" className='logo' />
      <ul className={mobileMenu?'':'hide-mobile-menu'}>
        <li><Link to='hero' smooth={true} offset={0} duration={500}>Home</Link></li>
        <li><Link to='about' smooth={true} offset={-150} duration={500}>About us</Link></li>
        <li><Link to='campus' smooth={true} offset={-260} duration={500}>Gallary</Link></li>
        <li><Link onClick={handleExploreMoreClick} to='/LoginSignup' smooth={true} offset={-260} duration={500}>Login/Sign Up</Link></li>


      </ul>
      <img src={menu_icon} alt="" className='menu-icon' onClick={toggleMenu}/>
    </nav>
  )
}

export default Navbar
