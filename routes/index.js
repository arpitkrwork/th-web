const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');

// Home page route (No auth needed)
router.get('/', (req, res) => {
  res.render('index');
});

// Protected bookings route
router.get('/bookings', authMiddleware, async (req, res) => {
  try {
    res.json({ message: 'Protected route / you have access to this protected route', user: req.user });
  } catch (error) {
    res.status(500).json({ message: 'Error occurred', error });
  }
});

// Booking route
router.post('/book', appointmentController.bookAppointment);

module.exports = router;
