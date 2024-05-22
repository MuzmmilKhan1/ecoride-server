const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { signUpUser, loginUser, allUsers, requestDetails, 
  changePassword, changeEmail, changePhoneNumber, deleteAccount } = require('../Controller/user');

// Route to sign up a new user with data validation
// /api/users/signup
router.post('/signup', [
  body('phoneNumber').notEmpty().withMessage('Phone Number  is required'),
  body('cnic').notEmpty().withMessage('CNIC is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], signUpUser);

// /api/users/login
router.post('/login', [
  body('cnic').notEmpty().withMessage("CNIC is required"),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password must be at least 6 characters long')
], loginUser)

router.post('/change-email', [
  body('newEmail').notEmpty().withMessage("Please Enter the Email")
], changeEmail);

router.post('/change-password', [
  body('newPassword').notEmpty().withMessage("Please Enter New Password")
], changePassword);

router.post('/change-phone-number', [
  body('newPhoneNumber').notEmpty().withMessage("Please Enter New Phone Number")
], changePhoneNumber);

router.post('/delete-account', [
  body('id').notEmpty().withMessage("Please Login First")
], deleteAccount);

router.get('/allusers',allUsers);

router.post('/details', [
  body('id').notEmpty().withMessage("Id Not Found. Please Login to continue")
], requestDetails);

module.exports = router;
