// ============================================
// Portfolio OS 2026 — Contact Controller
// ============================================
// Request handler for the contact form endpoint.
// This is the only POST endpoint in the API.
//
// MVC Flow: Route → Validator → Controller → Service → Nodemailer

const contactService = require('../services/contactService');

/**
 * POST /api/contact
 * Processes a contact form submission.
 *
 * Request body:
 *   { name, email, subject, message }
 */
const sendMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    const result = await contactService.sendContactMessage({
      name,
      email,
      subject,
      message,
    });

    res.status(200).json({
      success: true,
      message: 'Your message has been received. Thank you for reaching out!',
      data: {
        sent: result.sent,
        messageId: result.messageId || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
};
