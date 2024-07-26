

import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from '../components/Homepage/Home';
import AddressPage from '../components/Address/AddressPage';
import PersonalDetail from '../components/PersonalDetail/personaldetail';
import Document from '../components/DocumentUpload/Document';
import PrivacySecurity from '../components/ChangePassword/PrivacySecurity';
import PasswordChange from '../components/ChangePassword/changepassowrd';
import AddressManagementPage from '../components/Address/AddressManagementPage ';
import Login from '../components/Login/Login';
import SignUp from '../components/SignUpPage/signup';
import EmailPage from '../components/OtpPage/email';
import OTPPage from '../components/OtpPage/otp';
import PhonePage from '../components/OtpPage/phone';
import ForgetPasswordPage from '../components/ForgetPassword/forgetpassword';
import ProfilePage from '../components/Profile/profile';
import EmploymentCitizenshipForm from '../components/Employment/employment';
import Account from '../components/AccountInfo/account_info';
import RegistrationSuccess from '../components/SignUpPage/registrationsuccess';



const AppNavigation = () => {
    return (
     
      
    <BrowserRouter>
     
    
        <Routes>
       
           <Route path="/" element={<Home/>}  />
           <Route path="/account" element={<Account/>}  />
           <Route path="/employment" element={<EmploymentCitizenshipForm/>}  />
           <Route path="/signup" element={<SignUp />} />
           <Route path="/privacysecurity" element={<PrivacySecurity />} />
           <Route path="/passwordchange" element={<PasswordChange />} />
           <Route path="/personal-details" element={<PersonalDetail />} />          
           <Route path="/address" element={<AddressPage />} />
           <Route path="/addressManagement" element={<AddressManagementPage />} />
           <Route path="/documentUpload" element={<Document/>} />
           <Route path="/login" element={<Login />} />
           <Route path="/email" element={<EmailPage/>}  />
           <Route path="/phone" element={<PhonePage/>}  />
           <Route path="/otp" element={<OTPPage/>}  />
           <Route path="/forgetpassword" element={<ForgetPasswordPage/>}  />                
           <Route path="/profile" element={<ProfilePage />} />
           <Route path="/registersuccess" element={<RegistrationSuccess/>}  />

       
        </Routes>
       
      </BrowserRouter>
      
         
    ); 
  };
 
  
export default AppNavigation;

 