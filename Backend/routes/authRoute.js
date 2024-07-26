import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import * as customerController from '../controllers/customerController.js';

dotenv.config();

const router = express.Router();

router.use(express.json());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/mail-verification', customerController.mailVerification);
router.get('/reset-password', customerController.resetPassword);
router.post('/reset-password', customerController.updatePassword);
router.get('/reset-success', customerController.resetSuccess);

export default router;
