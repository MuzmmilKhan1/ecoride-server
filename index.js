// Import required modules
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const userRouter = require('./Routes/userRouter');
const stationRouter = require('./Routes/stationRouter');
const payemetRouter = require('./Routes/payementRouter');
require('dotenv').config();


// Create an instance of Express
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Check
app.get('/check', (req, res) => {
  res.send('Server Running!');
});


// Use the userRouter

app.use('/api/users', userRouter);
app.use('/api/stations', stationRouter);
app.use('/api', payemetRouter);

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle all other routes with the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
