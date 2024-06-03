import React from 'react'
import './About.css'
import about_img from '../Assets/LIB.jpg'
import play_icon from '../Assets/play-icon.png'
function About() {
  return (
    <div className='about'>
      <div className="about-left">
        <img src={about_img} alt="" className='about-img'/>
      </div>
      <div className="about-right">
        <h3>ABOUT BOOKSHARE</h3>
        <h2>Nurturing Tomorrow's Leaders Today</h2>
        <p>Without completely comprehensive libraries, academic institutions are incomplete. It is packed to the brim with educational and recreational things. As a result, these overflowing materials imply masses of inventory.</p>
        <p> A library management system can help you seamlessly transition from manually managed libraries to automated libraries, making them more efficient and effective.</p>
        <p>So why should libraries remain operating in an outdated manner in a digital age where the education industry is seeking to automate its space? Keeping track of hundreds of books regularly is a challenging task.</p>
      </div>
    </div>
  )
}

export default About
