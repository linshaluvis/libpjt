import './loginsignup.css';
import user_icon from '../Assets/person.png'; // Corrected icon for user
import email_icon from '../Assets/email.png'; // You might need this for signup
import password_icon from '../Assets/password.png';
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Loginnavbar from '../loginnavbar/loginnavbar';
import Footer from '../Footer/Footer';



function LoginSignup() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const passref = useRef(null);

    function togglePasswordVisibility() {
        if (passref.current.type === "text") {
            passref.current.type = "password";
        } else {
            passref.current.type = "text";
        }
    }

    const handleCreateAccount = () => {
        navigate('/signup');
    };

    const handleSubmit = () => {
        if (username && passref.current.value) {
            let data = {
                username: username,
                password: passref.current.value,
            };
            axios.post('http://127.0.0.1:8000/loginview', data, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then((res) => {
                const { token, role } = res.data;
                localStorage.setItem('token', token); // Store the token in localStorage
                if (role === 'admin') {
                    navigate('/adminhome'); // Redirect to admin panel
                } else {
                    navigate('/userhome'); // Redirect to user page
                }
            })
            .catch((err) => {
                console.error('Login failed', err);
                alert('Login failed. Please check your username and password.');
            });
        } else {
            alert('Enter username and password');
        }
    };

    return (
        <div>
                        <Loginnavbar />

        
        <div className="Homee">
            <div className="Container-login">
                <div className="Header">
                    <div className="text text-center">
                        <h1>LOGIN</h1>
                    </div>
                    <div className="underline"></div>
                </div>
                <div className="inputs">
                    <div className="input">
                        <img src={user_icon} alt="User Icon" />
                        <input
                            type="text"
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="User Name"
                        />
                    </div>
                    <div className="input">
                        <img src={password_icon} alt="Password Icon" />
                        <input
                            type="password"
                            ref={passref}
                            placeholder="Password"
                        />
                        <i
                            className="fa fa-eye eye-icon"
                            onClick={togglePasswordVisibility}
                        ></i>
                    </div>
                </div>
                <p className="small text-center forgot">
                    <Link to={"/forgot_password"}>
                        Forgot password?
                    </Link>
                </p>
                <div className="submit-container">
                    <div className="submit">
                        <button onClick={handleSubmit}>
                            LOGIN
                        </button>
                    </div>
                </div>
                <button
                    onClick={handleCreateAccount}
                    className="btn"
                >
                    Create Account
                </button>
            </div>
        </div>
        <br></br>
        <Footer/>
        </div>
        
    );
}

export default LoginSignup;
