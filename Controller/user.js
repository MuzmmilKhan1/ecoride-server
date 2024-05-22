const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../Model/Users');
const bcrypt = require('bcrypt');

// Function to sign up a new user
async function signUpUser(req, res) {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { cnic, phoneNumber, email, password } = req.body;

    // Check if user with the same email or username already exists
    const existingUser = await User.findOne({ $or: [{ cnic }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with the same email or username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create a new user
    const newUser = new User({ cnic, phoneNumber, email, password: hashedPassword, accBalance: 0 });
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ 
      message: 'User created successfully', 
      token: token,
      user: newUser
     });
  } catch (error) {
    console.error('Error signing up user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


// Function to log in a user
async function loginUser(req, res) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { cnic, email, password } = req.body;
  
      // Check if user with the provided CNIC or email exists
      const user = await User.findOne({ $or: [{ cnic }, { email }] });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Compare the provided password with the hashed password stored in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Generate a JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  
      res.status(200).json({ 
        message: 'Login successful', 
        token: token,
        user: user
      });
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  async function requestDetails(req, res){
    try{
      const { id } = req.body;
      console.log(req);
      
      const user = await User.findById(id);

      return res.status(200).json({
        success: true,
        user: user
      });
    }catch(error){
      console.log(error);

      return res.status(400).json({
        success: false,
        error: error
      })
    }
  }

  async function allUsers (req,res) {
    try 
    { 
      const users = await User.find();
      if(users)
      {
        res.status(200).json({
          success:true,
          users,
        });
      }
    } 
    catch (error)
    {
      console.error('Error retrieving users:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  const changeEmail = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { id, newEmail } = req.body;
    console.log(req.body)
    try {
      // Update user's email in the database
      await User.findByIdAndUpdate(id, { email: newEmail });
      const user = await User.findById(id);
  
      res.json({ 
      message: 'Email changed successfully',
      user: user
       });
    } catch (error) {
      console.error('Error changing email:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const changePassword = async (req, res) => {
    // Validate input data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { id, newPassword } = req.body;
  
    try {

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.findByIdAndUpdate(id, { password: hashedPassword });
      const user = await User.findById(id);
  
      res.json({ message: 'Password changed successfully', user: user });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  // Controller for changing phone number
const changePhoneNumber = async (req, res) => {
  // Validate input data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id, newPhoneNumber } = req.body;

  try {
    // Update user's phone number in the database
    await User.findByIdAndUpdate(id, { phoneNumber: newPhoneNumber });
    const user = await User.findById(id);

    res.json({ message: 'Phone number changed successfully', user: user });
  } catch (error) {
    console.error('Error changing phone number:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteAccount = async (req, res) => {
  // Validate input data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.body;

  try {
    // Delete the user from the database
    await User.findByIdAndDelete(id);

    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { signUpUser, loginUser , allUsers, requestDetails,
   changePassword, changeEmail, changePhoneNumber, deleteAccount };
