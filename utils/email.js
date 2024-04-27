const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // secure: false,
    // logger: true,
    // tls: { rejectUnauthorized: true },
  });

  // 2) define the email options

  const mailOptions = {
    from: 'kiranct <user@gmail.info>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html:
  };
  // 3) actually send the email

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
