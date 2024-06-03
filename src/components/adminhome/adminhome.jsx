import React, { useEffect, useState } from 'react';
import './adminhome.css'
import AdminNavbar from '../adminnavbar/adminnavbar'; 


import { Link,redirect,useNavigate } from 'react-router-dom';



function ADMINHome() {

   


  return (
      <div>
       
        <AdminNavbar/>
        WELCOME ADMIN
    
  
    </div>
  );
}
export default ADMINHome;
