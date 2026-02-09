import { sendNotificationEmail, sendAutoReplyEmail } from '../utils/emailService.js';


export const submitContactForm = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      res.status(400);
      throw new Error('All fields are required');
    }
    
    const contactData = { name, email, subject, message };
    
    const [notificationResult, autoReplyResult] = await Promise.allSettled([
      sendNotificationEmail(contactData),
      sendAutoReplyEmail(contactData),
    ]);
    
    // Log results
    if (notificationResult.status === 'fulfilled') {
      console.log('✅ Notification email sent to admin:', notificationResult.value.messageId);
    } else {
      console.error('❌ Failed to send notification email:', notificationResult.reason);
    }
    
    if (autoReplyResult.status === 'fulfilled') {
      console.log('✅ Auto-reply sent to sender:', autoReplyResult.value.messageId);
    } else {
      console.error('❌ Failed to send auto-reply:', autoReplyResult.reason);
    }
    
    // Check if at least the notification email was sent
    if (notificationResult.status === 'rejected') {
      throw new Error('Failed to send message. Please try again later.');
    }
    
    res.status(200).json({
      success: true,
      message: 'Message sent successfully! You will receive a confirmation email shortly.',
    });
  } catch (error) {
    next(error);
  }
};
