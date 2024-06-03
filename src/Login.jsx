import React from 'react'
import './loginsignup.css'
import user_icon from '../Assets/email.png'
import email_icon from '../Assets/person.png'
import password_icon from '../Assets/password.png'

export const login = () => {
  return (

    <div className="Container">
        <div className="Header">
            <div className="text">SIGN UP</div>
            <div className="underline"></div>
        </div>
        <div className="inputs">
            <div className="input">
                <img src={user_icon} alt="" />
                <input type="text" />
            </div>
            <div className="input">
                <img src={email_icon} alt="" />
                <input type="email" />
            </div>
            <div className="input">
                <img src={password_icon} alt="" />
                <input type="password" />
            </div>
        </div>
    </div>
    
  )
}
export default Home;

