import { check } from 'express-validator';

export const sendMailVerificationValidator = [
    check('email', 'Please include a valid email').isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
];

export const passwodResetValidator = [
    check('email', 'Please include a valid email').isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
];
