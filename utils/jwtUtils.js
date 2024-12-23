// backend/utils/jwtUtils.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET; // Add your secret in .env file

// Function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },  // Payload: You can include any user data here
    JWT_SECRET,                          // Secret key for signing the token
    { expiresIn: '1h' }                 // Expiration time (e.g., 1 hour)
  );
};

// Function to verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;  // Return null if token is invalid or expired
  }
};

module.exports = { generateToken, verifyToken };
