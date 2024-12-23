const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, //  email here
      pass: process.env.EMAIL_PASS,  //  an app-specific password  2FA
    }
  });
  
  const sendEmail = (mailOptions) => {
    return transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email:', err); // Log email sending errors
      } else {
        console.log('Email sent: ' + info.response);
      }
    })
  };
  module.exports = sendEmail;

