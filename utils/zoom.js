// utils/zoom.js
const axios = require('axios');
const jwt = require('jsonwebtoken');
// createZoomMeeting; // Ensure this line is present

require('dotenv').config(); // Load environment variables from .env file

//  Zoom API Key and Secret from the Zoom App
const zoomApiKey = process.env.ZOOM_API_KEY;
const zoomApiSecret = process.env.ZOOM_API_SECRET;

// Function to generate a JWT for Zoom
const generateZoomJWT = () => {
  const payload = {
    iss: zoomApiKey, // Issuer:  Zoom API Key
    exp: Math.floor(Date.now() / 1000) + 3600, // Expiry time: Token will expire in 1 hour
  };
 
  return jwt.sign(payload, zoomApiSecret); // Generate JWT token
};

// Function to create a Zoom meeting
const createZoomMeeting = async (topic = 'Therapy Session', duration = 30) => {
  try {
    const token = generateZoomJWT(); // Generate the JWT token
    const response = await axios.post(
      'https://api.zoom.us/v2/users/me/meetings',
      {
        topic: topic,
        type: 2, // Scheduled meeting
        start_time: new Date().toISOString(), // Current time
        duration: duration, // Duration in minutes
        settings: {
          host_video: true, // Start with host video on
          participant_video: true, // Start with participant video on
        },
      },
      {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      }
    );
    return response.data.join_url; // Return the Zoom meeting link
  } catch (error) {
    console.error('Error creating Zoom meeting:', error);
    throw error; // Rethrow the error after logging it
  }
};

// Export the functions
module.exports = { createZoomMeeting, generateZoomJWT };