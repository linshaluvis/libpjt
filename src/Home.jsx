import React, { useEffect, useState } from 'react';
import './Home.css'
import { Link,redirect,useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import Campus from './components/Campus/Campus'
import Footer from './components/Footer/Footer'
import Title from './components/Title/Title'
import About from './components/About/About'





function Home() {

   


  return (
      <div>
       <Navbar/>
       <Hero/>
       <div className="container">
         
          <About />
          <Title subTitle='Gallery' title='Campus Photos'/>
          <Campus/>
         
       
          <Footer/>
       </div>

    
  
    </div>
  );
}
export default Home;
