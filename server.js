const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const axios = require('axios');
const sendEmail = require('./utils/email');
const app = express();
const PORT = 3000;


const { createZoomMeeting } = require('./utils/zoom');




require('dotenv').config();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection (Ensure MongoDB is running)
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));


  //after api adding mail functionality

  
// Define your models (e.g., Booking, User) if required
const Booking = mongoose.model('Booking', new mongoose.Schema({
  name: String,
  email: String,
  date: String,
  zoomLink: String,
}));

const zoomApiKey = process.env.ZOOM_API_KEY;
const zoomApiSecret = process.env.ZOOM_API_SECRET;
// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, 'frontend')));

// API route for booking sessions
app.post('/api/book', async (req, res) => {
  try {
    const { name, email, date } = req.body;
    

    // Generate a Zoom link (stub, replace with actual API integration)
    const zoomLink = await createZoomMeeting();

    // Save booking to database
    const booking = new Booking({ name, email, date, zoomLink });
    await booking.save();

const mailOptions ={
  from: process.env.EMAIL_USER,
      to: email,
      subject: 'Booking Confirmation',
      text: `Hello ${name},\n\nYour therapy session is confirmed for ${date}.\n\nHere is your Zoom link: ${zoomLink}`,
}
//send email
await sendEmail(mailOptions); // Add this in your POST /api/book route

    res.status(200).json({ message: 'Booking successful!', zoomLink });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to book session' });
  }
});

// API route to fetch all bookings (for admin or testing purposes)
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Catch-all route to serve the frontend's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});



