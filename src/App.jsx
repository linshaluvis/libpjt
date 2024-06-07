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



















import { BrowserRouter, Routes,Route } from 'react-router-dom';



function App() {

   


  return (
   
      <BrowserRouter>

      <Routes>
      <Route path="" element={<Home />}></Route>
        
      <Route path="/login" element={<LoginSignup />} />
      <Route path="/signup" element={<Signup />} />
      
      <Route path="/adminhome" element={<ADMINHome />} />
      <Route path="/userhome" element={<UserHome />} />
      <Route path="/add_category" element={<AddCategory />} />
      <Route path="/addbook" element={<AddBook />} />
      <Route path="/memberreg" element={<MemberReg />} />
      <Route path="/showbook" element={<Showbook />} />
      <Route path="/edit/:id" element={<EditBook />}/>
      <Route path="/Showmember" element={<Showmember />} />
      <Route path="/Memberprofile" element={<Memberprofile />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/forgot_password" element={<Forgot_password />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/checkoutsuccess" element={<CheckoutSuccess />} />
      <Route path="/borrow" element={<Borrow />} />
      <Route path="/borrow_admin" element={<BorrowAdmin />} />
      <Route path="/order" element={<Order />} />
      <Route path="/OverDueAdmin" element={<OverDueAdmin />} />
      <Route path="/orderuser" element={<Orderuser />} />
      <Route path="/notifications" element={<Notifications />} />























        

      </Routes>
      </BrowserRouter>
  
  
  );
}

export default App;


