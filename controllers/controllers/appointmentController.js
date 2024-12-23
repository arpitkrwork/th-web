const Razorpay = require('razorpay');
const Appointment = require('../models/appointment');
const sendEmail = require('../utils/email'); // Import the sendEmail function

// Razorpay configuration
const razorpay = new Razorpay({
  key_id: 'your_razorpay_key_id',  // Replace with your key
  key_secret: 'your_razorpay_key_secret'  // Replace with your secret
});

// Book appointment logic
exports.bookAppointment = async (req, res) => {
  try {
    const { name, email, therapist, date, time } = req.body;

    // Create appointment record
    const appointment = new Appointment({ name, email, therapist, date, time });
    await appointment.save();

    // Razorpay payment order creation
    const paymentOptions = {
      amount: 50000, // Amount in paise (₹500)
      currency: 'INR',
      receipt: `receipt_${appointment._id}`
    };

    razorpay.orders.create(paymentOptions, async (err, order) => {
      if (err) {
        console.error('Error creating Razorpay order:', err);
        return res.status(500).send('Payment order creation failed');
      }

      // Send email with Razorpay payment link
      try {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Complete Your Appointment Payment',
          text: `Please complete your payment to book the appointment. Payment link: ${order.short_url}`
        };

        // Call sendEmail function from utils/email.js
        await sendEmail(mailOptions);

        // Render payment page with Razorpay order
        res.render('payment', { order });
      } catch (emailErr) {
        console.error('Error sending email:', emailErr);
        res.status(500).send('Error sending payment email');
      }
    });
  } catch (err) {
    console.error('Error booking appointment:', err);
    res.status(500).send('Error booking appointment');
  }
};
