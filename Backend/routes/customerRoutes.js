
import express from 'express';
import { check, validationResult, body } from 'express-validator';
import upload from '../middleware/uploads/upload.js';
import { customerValidationRules, validate } from '../validations/customerValidation.js';
import { SignUpValidation } from '../validations/SignUpValidation.js';
import { sendMailVerificationValidator, passwodResetValidator } from '../helpers/validation.js';
import dotenv from 'dotenv';
import * as customerController from '../controllers/customerController.js';
import authenticateToken from '../middleware/jwt.js';


dotenv.config();

const router = express.Router();
router.use(express.json());

// Register and email auth API
router.post('/customers', customerValidationRules(), validate, customerController.createCustomer);
router.post('/employment', customerController.createEmploymentDetails);
router.post('/citizenship', customerController.createCitizenshipDetails);
router.post('/documents/upload', upload.array('documents'), customerController.uploadDocument);

router.post('/signup', SignUpValidation(), customerController.signup);
router.post('/login', customerController.loginUser);
router.post('/changepassword', [
    check('currentPassword').notEmpty().withMessage('Current password is required'),
    check('newPassword').isLength({ min: 5 }).withMessage('New password must be at least 5 characters long'),
], authenticateToken, customerController.changePassword);


router.post('/send-otp', customerController.sendOtp);
router.post('/verify-otp', customerController.verifyOtp);
router.post('/Verify-Email', sendMailVerificationValidator, customerController.updateEmail);
router.post('/forgot-password', passwodResetValidator, customerController.forgotPassword);
router.post('/updateAddress', customerController.updateAddress);
router.get('/profile', authenticateToken, customerController.getProfile);
router.post('/transaction', authenticateToken, customerController.Transaction);
router.get('/getTransaction', authenticateToken, customerController.GetTransaction);
router.post('/send-statement', authenticateToken, customerController.SendStatement);
router.get('/getBalance', authenticateToken, customerController.getBalance);

//profile update routes
router.post('/editname', authenticateToken, customerController.EditName );
router.post('/editaddress', authenticateToken, customerController.EditAddress );
router.post('/editcitizenship', authenticateToken, customerController.EditCitizenship );
router.post('/editcontact', authenticateToken, customerController.EditContact );
router.post('/editemployment', authenticateToken, customerController.EditEmployment );

//authenticated routes
router.get('/profile', auth, customerController.userProfile);
router.get('/refresh-token', auth, customerController.refreshToken);
router.get('/logout', auth, customerController.logout);


export default router;
