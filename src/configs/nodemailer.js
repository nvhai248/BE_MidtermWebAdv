const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'your_email@gmail.com',
    pass: 'your_password'
  }
});


const sendVerificationEmail = (email, verificationToken) => {
  let mailOptions = {
    from: 'your_email@gmail.com',
    to: email,
    subject: 'Verify by email!',
    html: `<p>Click <a href="${process.env.SITE_DOMAIN}/api/users/verify/${verificationToken}">here</a> to verify your email.</p>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error occurred while sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

const sendRenewPwEmail = (email, newPw) => {
    let mailOptions = {
      from: 'your_email@gmail.com',
      to: email,
      subject: 'Change password!',
      html: `<h1>This is new Password:</h1>
      <p>${newPw}</p>
      `
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error occurred while sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  };

module.exports = {sendVerificationEmail, sendRenewPwEmail};