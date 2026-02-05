import { sendNotificationEmail, sendAutoReplyEmail } from '../utils/emailService.js';

export const submitContactForm = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      res.status(400);
      throw new Error('All fields are required');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400);
      throw new Error('Please provide a valid email address');
    }
    
    const contactData = { name, email, subject, message };
    
    const [notificationResult, autoReplyResult] = await Promise.allSettled([
      sendNotificationEmail(contactData),
      sendAutoReplyEmail(contactData),
    ]);
    
    if (notificationResult.status === 'rejected') {
      throw new Error('Failed to send message. Please try again later.');
    }
    
    res.status(200).json({
      success: true,
      message: 'Message sent successfully! Check your email for confirmation.',
    });
  } catch (error) {
    next(error);
  }
};
