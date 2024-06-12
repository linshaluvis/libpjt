import React from 'react';
import Home from './Home';
import Signup from './components/signup/signup';
import LoginSignup from './components/login/loginsignup';
import ADMINHome from './components/adminhome/adminhome';
import UserHome from './components/user/userhome';
import AddCategory from './components/catagory/catagory';
import AddBook from './components/book/bookadd';
import MemberReg from './components/signup/signup';
import Showbook from './components/showbook/showbook';
import EditBook from './components/editbook/EditBook';
import Showmember from './components/member/showmember';
import Memberprofile from './components/user/userprofile';
import EditProfile from './components/user/editprofile'; 
import Cart from './components/cart/Cart'; 
import Forgot_password from './components/password/ForgotPassword'; 
import Checkout from './components/checkout/checkout'; 
import CheckoutSuccess from './components/checkout/CheckoutSuccess';
import Borrow from './components/user/borrow';
import BorrowAdmin from './components/adminhome/BorrowAdmin';
import Order from './components/adminhome/Order';
import OverDueAdmin from './components/adminhome/OverdueBooks';
import Orderuser from './components/user/orderuser';
import Notifications from './components/user/notificationuser';
import AdminNotifications from './components/adminhome/notifications';
import NavbarWrapper from './components/adminhome/NavbarWrapper';
import Changepassword from './components/user/changepassword';
























import { BrowserRouter, Routes,Route } from 'react-router-dom';



function App() {

   


  return (
   
      <BrowserRouter>
      <Routes>

      <Route path="/adminhome" element={<ADMINHome />} />
      <Route path="/add_category" element={<AddCategory />} />
      <Route path="/addbook" element={<AddBook />} />
      <Route path="/showbook" element={<Showbook />} />
      <Route path="/Showmember" element={<Showmember />} />
      <Route path="/borrow_admin" element={<BorrowAdmin />} />
      <Route path="/OverDueAdmin" element={<OverDueAdmin />} />
      <Route path="/order" element={<Order />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/AdminNotifications" element={<AdminNotifications />} />
      






      <Route path="" element={<Home />}></Route>
        
      <Route path="/login" element={<LoginSignup />} />
      <Route path="/signup" element={<Signup />} />
      
      <Route path="/userhome" element={<UserHome />} />
     
      <Route path="/memberreg" element={<MemberReg />} />
      <Route path="/edit/:id" element={<EditBook />}/>
      <Route path="/Memberprofile" element={<Memberprofile />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/forgot_password" element={<Forgot_password />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/checkoutsuccess" element={<CheckoutSuccess />} />
      <Route path="/borrow" element={<Borrow />} />
      <Route path="/orderuser" element={<Orderuser />} />
      <Route path="/Changepassword" element={<Changepassword />} />

     


        

      </Routes>
      </BrowserRouter>
  
  
  );
}

export default App;


