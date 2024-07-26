import { check } from 'express-validator';

 export const SignUpValidation = ()=>{
 return[
    check('username')
        .isLength({ min: 8, max: 20 })
        .withMessage('Username must be between 8 and 20 characters')
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage('Username must contain only alphanumeric characters'),
    
    check('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*\d)(?=.*[A-Z])/)
        .withMessage('Password must contain at least one number and one uppercase letter'),

    check('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
];
    }



