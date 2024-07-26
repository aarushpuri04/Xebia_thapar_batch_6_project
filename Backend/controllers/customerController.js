
// customerController.js in the controllers directory is the component that enables the interconnection between the views and the model so it acts as an intermediary. 
//The controller doesn’t have to worry about handling data logic, it just tells the model what to do. It processes all the business logic and incoming requests, manipulates data using the Model component, and interact with the View to render the final output.

import User from '../models/customerModel.js';
import upload from '../middleware/uploads/upload.js';
import fs from 'fs';
import crypto from 'crypto';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { promisify } from 'util';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import randomstring from 'randomstring';
import moment from 'moment';
import OtpModel from '../models/otp.js';
import PasswordReset from '../models/passwordReset.js';
import mailer from '../helpers/mailer.js';
import otpGenerator from 'otp-generator';
import twilio from 'twilio';
import mongoose from 'mongoose';
import cloudinary from '../middleware/cloudinary.js'; // Make sure to configure this

dotenv.config();

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Helper Functions
const generateAccessToken = async (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: "2h" });
};

// Step 1: Create Customer with Basic Info
const createCustomer = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { firstName, middleName, lastName, dob, address } = req.body;
        const existingUser = await User.findOne({ firstName, lastName, dob, address });

        if (existingUser) {
            return res.status(400).json({ success: false, msg: 'User already exists!' });
        }

        const user = new User({ firstName, middleName, lastName, dob, address });
        const userData = await user.save();

        return res.status(201).json({ success: true, msg: 'User created successfully!',
              userId: userData._id, // Send the customer ID to the frontend
                
                 user: userData });
       
          
    } catch (error) {
      console.error('Error creating customer:', error);
        return res.status(500).json({ success: false, msg: error.message });
    }
  };


// Step 2: Update Address
const updateAddress = async (req, res) => {
    try {
        const { userId, address } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found!' });
        }

        user.address = address;
        await user.save();

        return res.status(200).json({ success: true, msg: 'Address updated successfully!', user });
    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message });
    }
};

// Step 3: Update Email and Send Verification
const updateEmail = async (req, res) => {
  try {
    const { userId, email } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found!' });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.emailVerified) {
        return res.status(409).json({ success: false, msg: 'Email already exists and user verified!' });
      } else {
        const msg = `<p>Hi, ${user.name}, Please click <a href="http://127.0.0.1:3000/mail-verification?id=${existingUser._id}">here</a> to verify your email.</p>`;
        mailer.sendMail(email, 'Email Verification for XYZ Bank', msg);
        return res.status(200).json({ success: true, msg: 'Email exists but not verified. Verification link sent!' });
      }
    }

    user.email = email;
    user.emailVerified = false;
    await user.save();

    const msg = `<p>Hi, ${user.name}, Please click <a href="http://127.0.0.1:3000/mail-verification?id=${user._id}">here</a> to verify your email.</p>`;
    mailer.sendMail(email, 'Email Verification for XYZ Bank', msg);

    return res.status(200).json({ success: true, msg: 'Email updated and verification link sent!' });
  } catch (error) {
    
    return res.status(500).json({ success: false, msg: error.message });
  }
};

const mailVerification = async (req, res) => {
  console.log('mailVerification route hit');
  
  try {
    const userId = req.query.id;
    const acceptType = req.headers.accept;

    if (!userId) {
      if (acceptType.includes('application/json')) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
      } else {
        return res.status(400).render('404', { message: 'User ID is required' });
      }
    }

    const user = await User.findById(userId);
    if (!user) {
      if (acceptType.includes('application/json')) {
        return res.status(404).json({ success: false, message: 'User not found' });
      } else {
        return res.status(404).render('404', { message: 'User not found' });
      }
    }

    console.log("beforedata", user.emailVerified);

    if (user && !user.emailVerified) {
      user.emailVerified = true;
      await user.save();
      console.log("afterdata", user.emailVerified);
      if (acceptType.includes('application/json')) {
        return res.status(200).json({ success: true, message: 'Email verified successfully!', emailVerified: user.emailVerified });
      } else {
        return res.status(200).render('mail-verification', { message: 'Mail has been verified successfully!' });
      }
    } else {
      if (acceptType.includes('application/json')) {
        return res.status(200).json({ success: true, message: 'Email already verified!', emailVerified: true });
      } else {
        return res.status(200).render('mail-verification', { message: 'Your mail is already verified!' });
      }
    }
  } catch (error) {
    console.error('Error verifying email:', error);
    if (acceptType.includes('application/json')) {
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else {
      return res.status(500).render('error', { message: 'Internal Server Error' });
    }
  }
};

// Step 4: Update Mobile Number and Verify with OTP
const sendOtp = async (req, res) => {
  try {
    const { userId, phoneNumber } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found!' });
    }

    user.phone = phoneNumber;
    user.phoneVerified = false;
    await user.save();

    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
    const cDate = new Date();

    await OtpModel.findOneAndUpdate(
      { phoneNumber },
      { otp, otpExpiration: new Date(cDate.getTime() + 5 * 60000) },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // await twilioClient.messages.create({
    //   body: `Your OTP is: ${otp}`,
    //   to: phoneNumber,
    //   from: process.env.TWILIO_PHONE_NUMBER
    // });

    console.log(`Your OTP is: ${otp})`);

    return res.status(200).json({ success: true, msg: 'OTP sent successfully!'+ otp});
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    const otpData = await OtpModel.findOne({ phoneNumber, otp });

    if (!otpData) {
      return res.status(400).json({ success: false, msg: 'Invalid OTP!' });
    }

    const isOtpExpired = moment().isAfter(moment(otpData.otpExpiration));
    if (isOtpExpired) {
      return res.status(400).json({ success: false, msg: 'OTP has expired!' });
    }

    const user = await User.findOne({ phone: phoneNumber });
    if (user) {
      user.phoneVerified = true;
      await user.save();
    }

    // Delete the OTP after verification
    await OtpModel.deleteOne({ _id: otpData._id });

    return res.status(200).json({ success: true, msg: 'OTP verified successfully!' });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};
// Step 5: Create Employment and Citizenship Details
const createEmploymentDetails = async (req, res) => {
 
 const { userId ,type, ...data } = req.body;
  console.log("req:",req.body);
  console.log("hjbh",req.body.userId);
  console.log("data",data);
  console.log("type",type);


  try {
    console.log("start");
    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found!' });
    }
   
    user.employment ={
       type,
       ...data} 
    
    await user.save();

    res.status(201).json({ success: true, msg: 'Employment details saved successfully!', employment: user.employment});
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ error: 'Validation error', details: errors });
    }
    console.error('Failed to save employment:', error);
    res.status(500).send('Internal Server Error');
  }
};


// Step 6: Upload citizenship
const countries = [
  "United States", "Canada", "United Kingdom", "Australia", "Germany", "France",
  "Japan", "China", "India", "Brazil", "South Africa", "New Zealand", "Mexico",
  "Russia", "Italy", "Spain", "Netherlands", "Sweden", "Norway", "Finland", "Denmark"
];

const createCitizenshipDetails = async (req, res) => {
  try {
    const { userId, nationality, taxResidency } = req.body;

    // Validate nationality
    if (!countries.includes(nationality)) {
      return res.status(400).json({ error: 'Invalid nationality', message: `Nationality '${nationality}' is not valid.` });
    }

    // Validate tax residency
    if (!countries.includes(taxResidency)) {
      return res.status(400).json({ error: 'Invalid tax residency', message: `Tax residency '${taxResidency}' is not valid.` });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found!' });
    }

    user.citizenship = { nationality, taxResidency };

    await user.save();

    res.status(201).json({ message: 'Citizenship details saved successfully!', citizenship: user.citizenship });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      // Validation error
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      res.status(400).json({ error: 'Validation error', details: errors });
    } else {
      // General error
      res.status(500).json({ error: 'Failed to save citizenship details', message: error.message });
    }
  }
};



//Step 7: upload document

const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);


const uploadDocument = async (req, res) => {
  try {
      // const { userId, type: documentTypes } = req.body;
      const {type: documentTypes } = req.body;

      const userId = req.body.userId;

      if (!req.files || req.files.length === 0) {
          return res.status(400).json({ error: 'Please upload files!' });
      }

      if (!documentTypes || !(documentTypes.includes('PAN Card')) || !(documentTypes.includes('Aadhar Card'))) {
          return res.status(400).json({ error: 'Invalid document types! Must include both PAN Card and Aadhar Card.' });
      }

      const existingUser = await User.findById(userId);
      if (!existingUser) {
          return res.status(404).json({ error: 'User not found!' });
      }

      // Check if PAN Card and Aadhar Card are already present
      const hasPANCard = existingUser.documents.some(doc => doc.type === 'PAN Card');
      const hasAadharCard = existingUser.documents.some(doc => doc.type === 'Aadhar Card');

      if (hasPANCard && hasAadharCard) {
          return res.status(400).json({ error: 'PAN Card and Aadhar Card are already present!' });
      }

      const uploadedDocuments = [];

      for (let i = 0; i < req.files.length; i++) {
          const file = req.files[i];
          const filePath = file.path;
          const documentType = documentTypes[i];

          // Skip upload if the document type is already present
          if ((documentType === 'PAN Card' && hasPANCard) || (documentType === 'Aadhar Card' && hasAadharCard)) {
              await fs.unlinkSync(filePath); // Remove the duplicate file from local storage
              return res.status(400).json({ error: `File ${file.originalname} already exists for document type ${documentType}!` });
          }

          const cloudinaryUploadResult = await cloudinary.uploader.upload(filePath, {
              resource_type: 'auto',
              overwrite: false,
              unique_filename: true
          });

          const documentObject = {
              type: documentType,
              fileName: cloudinaryUploadResult.original_filename,
              downloadLink: cloudinaryUploadResult.secure_url,
              uploadedAt: new Date(),
              filePath: cloudinaryUploadResult.secure_url,
              publicId: cloudinaryUploadResult.public_id
          };

          uploadedDocuments.push(documentObject);
      }

      existingUser.documents = [...existingUser.documents, ...uploadedDocuments];
      const savedUser = await existingUser.save();

      res.status(200).json({ message: 'Files uploaded successfully', documents: savedUser.documents });

  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Failed to upload files' });
  }
};

// Step 8: Signup with Username and Password
const signup = async (req, res) => {
  try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { userId, username, password, confirmPassword } = req.body;

      if (password !== confirmPassword) {
        return res.status(400).json({ success: false, msg: 'Passwords do not match!' });
    }

      // Check if user exists by ID
      const existingUser = await User.findById(userId);

      if (!existingUser) {
          console.log("User does not exist.");
          return res.status(404).json({ success: false, msg: 'User not found!' });
      }

      // Check if username is already set for this user
      if (existingUser.username) {
          console.log("User exists and username is taken");
          return res.status(400).json({ success: false, msg: 'Username already set for this user!' });
      }

      // Check if username is taken by another user
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
          console.log("User exists and username is taken");
          return res.status(400).json({ success: false, msg: 'Username already exists!' });
      }

      // Set username and password
      const hashPassword = await bcrypt.hash(password, 10);
      existingUser.username = username;
      existingUser.password = hashPassword;
      await existingUser.save();

      console.log("User exists, username set!");
      return res.status(201).json({ success: true, msg: 'Username and password set successfully!' });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, msg: error.message });
  }
};

// Step 9: Login
const loginUser = async (req, res) => {
  try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { username, password } = req.body;
      console.log(username, password);
      
      // First, check if the user exists by username
      const user = await User.findOne({ username });

      if (!user) {
          console.log("User does not exist.");
          return res.status(400).json({ success: false, msg: 'Invalid username or password!' });
      }

      // If user exists, check the password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
          console.log("User exists but password doesn't match.");
          return res.status(400).json({ success: false, msg: 'Invalid username or password!' });
      }

      // If everything is correct, generate token and login
      const accessToken = await generateAccessToken({ user: user._id });
      console.log("User logged in successfully.");
      return res.status(200).json({ success: true, msg: 'Login successful!', token: accessToken });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, msg: error.message });
  }
};


// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: 'Errors',
        errors: errors.array()
      });
    }

    const { email } = req.body;
    const userData = await User.findOne({ email });

    if (!userData) {
      return res.status(400).json({
        success: false,
        msg: "Email doesn't exist!"
      });
    }

    const randomString = randomstring.generate();
    const msg = `<p>Hi, ${userData.firstName}, Please click <a href="http://127.0.0.1:3000/reset-password?token=${randomString}">here</a> to reset your password.</p>`;

    await PasswordReset.deleteMany({ user_id: userData._id });

    const passwordReset = new PasswordReset({
      user_id: userData._id,
      token: randomString
    });

    await passwordReset.save();

    mailer.sendMail(userData.email, 'Reset Password', msg);

    return res.status(201).json({
      success: true,
      msg: 'Reset password link sent to your mail!'
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message
    });
  }
};


// Reset Password
const resetPassword = async (req, res) => {
  try {
    if (!req.query.token) {
      return res.render('404');
    }

    const resetData = await PasswordReset.findOne({ token: req.query.token });

    if (!resetData) {
      return res.render('404');
    }

    return res.render('reset-password', { resetData });
  } catch (error) {
    return res.render('404');
  }
};

//updatePassword pass method working of post of reset password
const updatePassword = async (req, res) => {
  try {

      const { user_id, password, c_password } = req.body;

      const resetData = await PasswordReset.findOne({ user_id: user_id });

      if (password !== c_password) {

          return res.render('reset-password', { resetData, error: 'Confirm Password not matching!' });
      }

      //after successful confirm password
      const hashedPassword = await bcrypt.hash(c_password, 10);
      await User.findByIdAndUpdate({ _id: user_id }, {
          $set: {
              "password": hashedPassword
          }
      }); // noe once password is updated weahve to empty token

      await PasswordReset.deleteMany({ user_id });
      // route to new
      return res.redirect('/reset-success');

  }
  catch (error) {
      return res.render('404');
  }

};
// Reset Success

const resetSuccess = async (req, res) => {
  try {
      return res.render('reset-success');
  }
  catch (error) {
      return res.render('404');
  }
};

const changePassword = async (req, res) => {
  
  try {
    const { currentPassword, newPassword, confirm_password } = req.body;
    const token = req.headers.authorization.split(' ')[1];

    console.log("tokem",token)

    if (!token) {
      return res.status(401).json({ success: false, msg: 'No token provided' });
  }
   
    // Verify the token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);

    const currentTimestamp = Math.floor(Date.now() / 1000);//
    if (decoded.exp < currentTimestamp) {
    return res.status(401).json({ success: false, msg: 'Token expired. Please log in again.' });//
}
    const userId = decoded.user;
    // const userId = decoded.userId;

    console.log("userid",userId)

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found!' });
    }

    // Check if new password matches confirm password
    if (newPassword !== confirm_password) {
      return res.status(400).json({ success: false, msg: 'Confirm password does not match new password!' });
    }

    // Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, msg: 'Current password is incorrect!' });
    }

    // If all checks pass, update the password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Optionally, delete any existing password reset tokens
    await PasswordReset.deleteMany({ userId });

    return res.status(200).json({ success: true, msg: 'Password updated successfully!' });
  } catch (error) {
    console.error('Error in changePassword:', error);
    return res.status(500).json({ success: false, msg: 'An error occurred while updating the password.' });
  }
};


// Profile endpoint
 const getProfile = async (req, res) => {
  try {

    const token = req.headers.authorization.split(' ')[1];

    console.log("profile tokem",token)

    if (!token) {
      return res.status(401).json({ success: false, msg: 'No token provided' });
  }
   
    // Verify the token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);

    const currentTimestamp = Math.floor(Date.now() / 1000);//
    if (decoded.exp < currentTimestamp) {
    return res.status(401).json({ success: false, msg: 'Token expired. Please log in again.' });//
}
    const userId = decoded.user;

    // const customerId = req.params.customerId.trim();
    console.log('Backend Customer ID:', userId); // Debug log

    const customer = await User.findById(userId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

  
    res.status(200).json({
      customer
    });
  } catch (error) {
    
      if (error.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid customerId format' });
      }

    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Error fetching profile' });
  }
};



const Transaction =async (req, res) => {
  
  const token = req.headers.authorization.split(' ')[1];

    console.log("profile tokem",token)

    if (!token) {
      return res.status(401).json({ success: false, msg: 'No token provided' });
  }
   
    // Verify the token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);

    const currentTimestamp = Math.floor(Date.now() / 1000);//
    if (decoded.exp < currentTimestamp) {
    return res.status(401).json({ success: false, msg: 'Token expired. Please log in again.' });//
}
    const userId = decoded.user;

    // const customerId = req.params.customerId.trim();
    console.log('Backend Customer ID:', userId); // Debug log

 const { name, transaction_type, amount } = req.body;

 const xamount=parseFloat(amount);

 try {
   // Fetch user from database
   let user = await User.findById(userId);

   if (!user) {
     return res.status(404).json({ error: 'User not found' });
   }

   // Update balance based on transaction type
   if (transaction_type === 'withdraw') {
     user.balance -= xamount;
   } else if (transaction_type === 'deposit') {
     user.balance += xamount;
   } else {
     return res.status(400).json({ error: 'Invalid transaction type' });
   }

   // Save updated user balance
   await user.save();

   // Create transaction record
   user.transactions.push({
     name,
     transaction_type,
     amount:xamount,
     updated_balance: user.balance
   });

   // Save user with updated transaction history
   await user.save();

   // Respond with success message
   res.status(200).json({ message: 'Transaction added successfully', user });

 } catch (err) {
   console.error(err);
   res.status(500).json({ error: 'Server error' });
 }
};



const getBalance = async (req, res) => {
  try {
    console.log("Request received at getBalance");

      if (!req.headers.authorization) {
          console.log("No authorization header found");
          return res.status(401).json({ success: false, msg: 'No token provided' });
      }else{
        console.log("authorization header found");
      }

      const token = req.headers.authorization.split(' ')[1];

      console.log("getBalance token", token);

      if (!token) {
          return res.status(401).json({ success: false, msg: 'No token provided' });
      }

      // Verify the token
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);

      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTimestamp) {
          return res.status(401).json({ success: false, msg: 'Token expired. Please log in again.' });
      }

      const userId = decoded.user;

      console.log('Backend Customer ID:', userId); // Debug log

      // Fetch user from database by ID
      const customer = await User.findById(userId);

      if (!customer) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Send the customer data to the frontend
      res.status(200).json({ customer });

  } catch (error) {
      console.error('Error fetching user balance:', error);
      res.status(500).json({ error: 'Server error' });
  }
};



// Route handler to send statement PDF via email
// Configure multer for file uploads

const SendStatement = async (statement) => {
  try {
    const { to, subject, text } = req.body;
    const pdfFile = req.file;

    if (!to || !pdfFile) {
        return res.status(400).send('Missing required fields');
    }

    // Prepare email content with PDF attachment
    const mailOptions = {
        email: to,
        subject: subject,
        content: `<p>${text}</p>`, // Email body content
        attachments: [
            {
                filename: pdfFile.originalname,
                content: pdfFile.buffer,
                encoding: 'base64'
            }
        ]
    };

    // Use the mailer module to send email
    await mailer.sendMail(mailOptions);

    res.status(200).send('Email sent successfully');
} catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
}
};


const GetTransaction = async (req, res) => {
  try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
          return res.status(401).json({ success: false, msg: 'No token provided' });
      }

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);

      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTimestamp) {
          return res.status(401).json({ success: false, msg: 'Token expired. Please log in again.' });
      }

      const userId = decoded.user;
      console.log('Backend User ID:', userId); // Debug log

      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const transactions = user.transactions || []; // Ensure it's an array

      res.status(200).json(transactions);
  } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ message: 'Server Error' });
  }
};

//Personal Details edit 

const EditName = async (req, res) => {
  try {
    // Extract token from headers
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, msg: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTimestamp) {
      return res.status(401).json({ success: false, msg: 'Token expired. Please log in again.' });
    }

    // Extract user ID from token
    const userId = decoded.user;

    // Extract new values from request body
    const { firstName, middleName, lastName, dob} = req.body;

    // Validate required fields
    if (!firstName || !lastName || !dob ) {
      return res.status(400).json({ success: false, msg: 'Required fields missing' });
    }

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }
 
     // Update user fields only if they are provided
     if (firstName !== undefined) user.firstName = firstName;
     if (middleName !== undefined) user.middleName = middleName;
     if (lastName !== undefined) user.lastName = lastName;
     if (dob !== undefined) user.dob =dob;  
    //  if (address !== undefined) user.address =address;  

    // Save updated user
    await user.save();

    // Return success response with updated user data
    return res.status(200).json({ success: true, msg: 'Profile updated successfully!', user });
  } catch (error) {
    console.error('Error updating profile:', error.message);
    return res.status(500).json({ success: false, msg: 'Internal server error' });
  }
};

const EditAddress = async (req, res) => {
  try {
    // Extract token from headers
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, msg: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTimestamp) {
      return res.status(401).json({ success: false, msg: 'Token expired. Please log in again.' });
    }

    // Extract user ID from token
    const userId = decoded.user;

    // Extract new values from request body
    const { address} = req.body;

    // Validate required fields
    if (!address) {
      return res.status(400).json({ success: false, msg: 'Required fields missing' });
    }

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

   
     // Update user fields only if they are provided      
      user.address = {
        ...user.address,  // Preserve existing fields
        ...address  // Override with new values
      };
    // Save updated user
    await user.save();

    // Return success response with updated user data
    return res.status(200).json({ success: true, msg: 'Profile updated successfully!', user });
  } catch (error) {
    console.error('Error updating profile:', error.message);
    return res.status(500).json({ success: false, msg: 'Internal server error' });
  }
};



const EditCitizenship = async (req, res) => {
  try {
    // Extract token from headers
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, msg: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTimestamp) {
      return res.status(401).json({ success: false, msg: 'Token expired. Please log in again.' });
    }

    // Extract user ID from token
    const userId = decoded.user;

    // Extract new values from request body
    const { citizenship } = req.body;

    // Validate required fields
    if (!citizenship) {
      return res.status(400).json({ success: false, msg: 'Required fields missing' });
    }

    const { nationality, taxResidency } = citizenship;

    // Validate nationality if provided
    if (nationality && !countries.includes(nationality)) {
      console.log('Invalid nationality:', nationality);
      return res.status(400).json({ success: false, msg: `Invalid nationality '${nationality}'` });
    }

    // Validate tax residency if provided
    if (taxResidency && !countries.includes(taxResidency)) {
      console.log('Invalid tax residency:', taxResidency);
      return res.status(400).json({ success: false, msg: `Invalid tax residency '${taxResidency}'` });
    }

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    // Update user fields only if they are provided
    if (nationality) user.citizenship.nationality = nationality;
    if (taxResidency) user.citizenship.taxResidency = taxResidency;

    // Save updated user
    await user.save();

    // Return success response with updated user data
    return res.status(200).json({ success: true, msg: 'Profile updated successfully!', user });
  } catch (error) {
    console.error('Error updating profile:', error.message);
    return res.status(500).json({ success: false, msg: 'Internal server error' });
  }
};



const EditContact = async (req, res) => {
  try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
          return res.status(401).json({ success: false, msg: 'No token provided' });
      }

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTimestamp) {
          return res.status(401).json({ success: false, msg: 'Token expired. Please log in again.' });
      }

      const userId = decoded.user;
      const { email, phone } = req.body;

      console.log('Request body:', req.body);

      if (!phone) {
          return res.status(400).json({ success: false, msg: 'Required fields missing' });
      }
      if (!email) {
        return res.status(400).json({ success: false, msg: 'Required fields missing' });
    }

      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ success: false, msg: 'User not found' });
      }

      
       // Update user fields only if they are provided
    if (email !== undefined) {
      user.email = email;
    }
    if (phone !== undefined) {
      user.phone = phone;
    }

      await user.save();
      return res.status(200).json({ success: true, msg: 'Profile updated successfully!', user });
  } catch (error) {
      console.error('Error updating profile:', error.message);
      return res.status(500).json({ success: false, msg: 'Internal server error' });
  }
};


const EditEmployment = async (req, res) => {
  try {
    // Extract token from headers
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, msg: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTimestamp) {
      return res.status(401).json({ success: false, msg: 'Token expired. Please log in again.' });
    }

    // Extract user ID from token
    const userId = decoded.user;

    // Extract new values from request body
    const { employment } = req.body;

    // Validate required fields
    if (!employment) {
      return res.status(400).json({ success: false, msg: 'Required fields missing' });
    }

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    // Define an update object to hold the new values
    const update = { ...user.employment };

    if (employment.type === 'full-time') {
      if (employment.company) update.company = employment.company;
      if (employment.position) update.position = employment.position;
      if (employment.startDate) update.startDate = employment.startDate;
      if (employment.salary) update.salary = employment.salary;
    } else if (employment.type === 'part-time') {
      if (employment.company) update.company = employment.company;
      if (employment.position) update.position = employment.position;
      if (employment.hours) update.hours = employment.hours;
      if (employment.hourlyRate) update.hourlyRate = employment.hourlyRate;
    } else if (employment.type === 'self-employed') {
      if (employment.businessName) update.businessName = employment.businessName;
      if (employment.industry) update.industry = employment.industry;
      if (employment.yearsBusiness) update.yearsBusiness = employment.yearsBusiness;
      if (employment.annualIncome) update.annualIncome = employment.annualIncome;
    } else if (employment.type === 'retired') {
      if (employment.retirementDate) update.retirementDate = employment.retirementDate;
      if (employment.previousOccupation) update.previousOccupation = employment.previousOccupation;
      if (employment.pension) update.pension = employment.pension;
    } else if (employment.type === 'student') {
      if (employment.school) update.school = employment.school;
      if (employment.major) update.major = employment.major;
      if (employment.graduationYear) update.graduationYear = employment.graduationYear;
      if (employment.partTimeJob) update.partTimeJob = employment.partTimeJob;
    } else if (employment.type === 'not-employed') {
      if (employment.lastJob) update.lastJob = employment.lastJob;
      if (employment.reason) update.reason = employment.reason;
      if (employment.seekingWork) update.seekingWork = employment.seekingWork;
    }

    // Update the user employment data
    user.employment = update;

    // Save updated user
    await user.save();

    // Return success response with updated user data
    return res.status(200).json({ success: true, msg: 'Profile updated successfully!', user });
  } catch (error) {
    console.error('Error updating profile:', error.message);
    return res.status(500).json({ success: false, msg: 'Internal server error' });
  }
};

const userProfile = async (req, res) => {
  try {
      const userData = req.user.user;
      return res.status(200).json({
          success: true,
          msg: 'User Profile Data!',
          data: userData
      });
  } catch (error) {
      return res.status(400).json({
          success: false,
          msg: error.message
      });
  }
};

const refreshToken = async(req, res) => {
  try {
    const userId = req.user.user._id;

    const user = await User.findOne({_id: userId})

    const accessToken = await generateAccessToken({ user: user._id });
    const refreshToken = await generateRefreshToken({ user: user._id });
    
    return res.status(200).json({
      success: true,
      msg: 'Token Refreshed!',
      accessToken: accessToken,
      refreshToken: refreshToken
  });

} catch (error) {
    return res.status(400).json({
        success: false,
        msg: error.message
    });
}
};

const logout = async(req, res) => {
  try{
    // token will come in 
    const token = req.body.token || req.query.token || req.headers["authorization"];
    const bearer = token.split(' ');
    const bearerToken = bearer.length > 1 ? bearer[1] : bearer[0];

    //storing in db
    const newBlacklist = new BlacklistToken({
      token:bearerToken
    });
    await newBlacklist.save();

    res.setHeader('Clear-Site-Data', '"cookies","storage"');
    return res.status(200).json({
      success: true,
      msg: 'You are logged out!'
  });

  }
  catch (error) {
    return res.status(400).json({
        success: false,
        msg: error.message
    });
}
}






export {
  createCustomer,
  updateAddress,
  updateEmail,
  mailVerification,
  sendOtp,
  verifyOtp,
  createEmploymentDetails,
  createCitizenshipDetails,
  uploadDocument,
  signup,
  loginUser,
  forgotPassword,
  resetPassword,
  updatePassword,
  resetSuccess,
  changePassword,
  getProfile,
  Transaction,
  GetTransaction,
  SendStatement,
  getBalance,
  EditName ,
  EditAddress,
  EditCitizenship,
  EditContact,
  EditEmployment,
  userProfile,
  refreshToken,
  logout
};

