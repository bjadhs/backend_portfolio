import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendNotificationEmail = async (contactData) => {
  const { name, email, subject, message } = contactData;
  const toEmail = process.env.TO_EMAIL || process.env.SMTP_USER;
  
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: `New Contact: ${subject}`,
    html: `
      <h2>New Contact Form Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <h3>Message:</h3>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
    text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
  };
  
  return transporter.sendMail(mailOptions);
};

export const sendAutoReplyEmail = async (contactData) => {
  const { name, email, subject } = contactData;
  
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"Bijaya Adhikari" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Thank you for contacting me!',
    html: `
      <h2>Hi ${name},</h2>
      <p>Thank you for contacting me through my portfolio website.</p>
      <p>I received your message about: <strong>${subject}</strong></p>
      <p>I will get back to you within 24-48 hours.</p>
      <p>Best regards,<br>Bijaya Adhikari<br>Full-Stack Developer</p>
    `,
    text: `Hi ${name},\n\nThank you for contacting me. I received your message about: ${subject}\n\nI will get back to you within 24-48 hours.\n\nBest regards,\nBijaya Adhikari`,
  };
  
  return transporter.sendMail(mailOptions);
};
