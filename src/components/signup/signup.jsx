import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './signup.css'; // Import the CSS file for styling
import Loginnavbar from '../loginnavbar/loginnavbar'; 
import Swal from "sweetalert2";



function MemberReg() {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [img, setImg] = useState(null);
  const navigate = useNavigate();
  const baseURL = 'http://127.0.0.1:8000';


  const handleImageChange = (e) => {
    setImg(e.target.files[0]);
  };
  function togglePasswordVisibility() {
    if (setPassword.current.type == "text") {
      setPassword.current.type = "password";
    } else {
      setPassword.current.type = "text";
    }
  }
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  function checkUserPhone(phone) {
    document.getElementById("warnphone").textContent = "";
    var phoneNo = phone;
    if (phoneNo != "") {
      let data = {
        mobile:phone
      }
      axios.post(`${baseURL}/check_phone_number/`,data).then((res)=>{
        console.log('RESPONSE==',res)
        if (res.data.is_exists) {
          alert(res.data.message);
          document.getElementById("warnphone").textContent = "Phone Number exists.";
        } else {
          document.getElementById("warnphone").textContent = "";
        }
      }).catch((err)=>{
        console.log('ERROR==',err)
      })
    }
  }

  function checkUsername(username) {
    document.getElementById("userNameErr").textContent = "";
    var usr = username;
    if (usr != "") {
      let data = {
        userName:username
      }
      axios.post(`${baseURL}/check_username/`,data).then((res)=>{
        console.log('RESPONSE==',res)
        if (res.data.is_exists) {
          alert(res.data.message);
          document.getElementById("userNameErr").textContent = "Username exists.";
        } else {
          document.getElementById("userNameErr").textContent = "";
        }
      }).catch((err)=>{
        console.log('ERROR==',err)
      })
    }
  }

  function handlePhoneNumber(element) {
    var phoneinput = element.value;
    var phoneregexp = /^\d{10}$/;

    if (phoneinput.match(phoneregexp)) {
      document.getElementById("warnphone").innerHTML = "";
      checkUserPhone(phoneinput);
    } else {
      if (phoneinput.length > 10) {
        alert("Number should be 10 digit.");
        element.value = phoneinput.substring(0, 10);
        return;
      }
      document.getElementById("warnphone").innerHTML =
        "Please provide a valid Phone Number";
      alert("Please provide a valid Phone Number");
    }
  }
  function handleUsername() {
    console.log("ok")
    var userNameInput = document.getElementById("username");
    console.log(userNameInput)
    var userName = userNameInput.value.trim();
    if (userName !== "") {
      checkUsername(userName);
      console.log(userName)
    }
  }

  function validateForm() {
    var name = document.getElementById("fname").value.trim();
    var Mob = document.getElementById("number").value.trim();

    if (name === "") {
      alert("Please enter a valid name.!");
      return false;
    }

    if (Mob.length !== 10) {
      alert("Mobile Number should be 10 digits.!");
      return false;
    }
    return true;
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('user.first_name', fname);
    formData.append('user.last_name', lname);
    formData.append('user.username', username);
    formData.append('user.email', email);
    // formData.append('user.password', password);
    formData.append('number', number);
    formData.append('mebimage', img);
    let valid = validateForm();
    if (valid) {
      try {
  
      const res = await axios.post('http://127.0.0.1:8000/memberreg/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const token = res.data.token;  // Extract the token from the response
      localStorage.setItem('token', token);
      console.log(token);
      if (res.status === 201) {
        alert('Successfully registered, please wait for admin approval');
        navigate('/login');  // Redirect to the home page or any other page
      }
    } catch (err) {
      console.error('Error registering member:', err);
      if (err.response && err.response.data && err.response.data.error) {
        alert(err.response.data.error);  // Display the server-side error message
      } else {
        alert('Failed to register member');
      }
    }
  }
  };

  return (
    <div className="Home">
    <Loginnavbar/>
     <br />
    <div className="member-reg-container">
    <h2 className="text-uppercase text-center mb-4">
                    Create an account
                  </h2>
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label htmlFor="fname">First Name:</label>
          <input
            type="text"
            id="fname"
            value={fname}
            onChange={(e) => setFname(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="lname">Last Name:</label>
          <input
            type="text"
            id="lname"
            value={lname}
            onChange={(e) => setLname(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onBlur={handleUsername}

            onChange={(e) => setUsername(e.target.value)}
            required
            />
            <div className="text-danger" id="userNameErr"></div>
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
       
        <div>
          <label htmlFor="number">Contact Number:</label>
          <input
            type="text"
            id="number"
            value={number}
            onBlur={(e)=>{handlePhoneNumber(e.target)}}
            onChange={(e) => setNumber(e.target.value)}
            required
            />
            <div className="text-danger" id="warnphone"></div>

        </div>
        <div>
          <label htmlFor="img">Profile Image:</label>
          <input
            type="file"
            id="img"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
    </div>
  );
}

export default MemberReg;
