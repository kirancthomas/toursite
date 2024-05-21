const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
const Transport = require("nodemailer-brevo-transport");
// import Transport from 'nodemailer-brevo-transport';

module.exports = class Email {
  constructor (user, url){
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `kiranct <${process.env.EMAIL_FROM}>`

  }

  newTransport() {
    if(process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        host:'smtp-relay.brevo.com',
          port:587,
          secure: false,
          auth: {
            user: process.env.BREVO_USERNAME,
            pass: process.env.BREVO_PASSWORD,
            },
          
      })
        
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      
    });
  }
  //send the actual email 
  async send(template, subject) {
    //1) render HTML based on a pug template

     const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
     })

    //2) Define Email Options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
      //html;
    };

    // 3) create a transport and send email
    
    await this.newTransport().sendMail(mailOptions);

  }
  
  async sendWelcome(){
   await this.send('Welcome', 'welcome to the Natours Family')
  }

  async sendPassWordRest(){
    await this.send('passwordReset', 'Your password reset token valid for only 10 minutes')
  }
};




