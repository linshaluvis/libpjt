import React from 'react'
import './Footer.css'
import msg_icon from '../Assets/msg-icon.png'
import mail_icon from '../Assets/mail-icon.png'
import phone_icon from '../Assets/phone-icon.png'
import location_icon from '../Assets/location-icon.png'
import white_arrow from '../Assets/white-arrow.png'

const Footer = () => {
  return (
    
    <div className='footer'>
      <h2 className='text-footer'>Library Management System </h2>
      
      <div className="footer-col">
        
        <ul>
            <li><img src={mail_icon} alt="" />linshaluvis@gmail.com</li>
            <li><img src={phone_icon} alt="" />1234567890</li>
            <li><img src={location_icon} alt="" />ALTOS Technologies<br/> Infopark Kochi</li>
        </ul>
      </div>
    </div>

  )
}

export default Footer
