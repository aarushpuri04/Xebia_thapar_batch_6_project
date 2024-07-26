import { check, validationResult ,body} from 'express-validator';
import moment from 'moment';

// Custom validator to check if age is at least 18
const isAdult = (value) => {
  return moment().diff(moment(value, 'DD-MM-YYYY'), 'years') >= 18;
};

 export const customerValidationRules = () => {
  return [
    check('firstName')
      .isAlpha().withMessage('First name should contain only alphabetic characters')
      .notEmpty().withMessage('First name is required'),
    body('middleName')
      .if((value, { req }) => req.body.middleName !== undefined && req.body.middleName !== '')
      .isAlpha().withMessage('Middle name should contain only alphabetic characters'),
    check('lastName')
      .isAlpha().withMessage('Last name should contain only alphabetic characters')
      .notEmpty().withMessage('Last name is required'),
    check('dob')
      .matches(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/).withMessage('Invalid date of birth format! Format should be DD-MM-YYYY')
      .custom(isAdult).withMessage('Date of birth indicates age less than 18'),
    check('address.houseOrBuildingName')
      .notEmpty().withMessage('House or building name is required'),
    check('address.flatOrBuildingNumber')
      .notEmpty().withMessage('Flat or building number is required'),
    check('address.streetName')
      .notEmpty().withMessage('Street name is required'),
    check('address.townOrCity')
      .notEmpty().withMessage('Town or city is required'),
    check('address.state')
      .notEmpty().withMessage('State is required'),
    check('address.postcode')
      .matches(/^\d{5}(?:[-\s]\d{4})?$/).withMessage('Invalid postcode format'),
    check('address.country')
      .notEmpty().withMessage('Country is required')
  ];
};

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
  
    // If there are validation errors, log them and format them for the response
    const extractedErrors = errors.array().map(err => {
      console.log(`Validation error for ${err.param}: ${err.msg}`); // Log the validation error
      return { [err.param]: err.msg };
    });
  
    return res.status(422).json({ errors: extractedErrors });
  };
  