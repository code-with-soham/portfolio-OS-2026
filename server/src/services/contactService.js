// ============================================
// Portfolio OS 2026 — Contact Service
// ============================================
// Business logic layer for the contact form.
// Handles email sending via Nodemailer.
// Falls back to logging if SMTP is not configured.
//
// MVC Flow: Route → Controller → Service → Nodemailer

const nodemailer = require('nodemailer');
const config = require('../config/config');

/**
 * Creates a Nodemailer transporter based on environment configuration.
 * If SMTP credentials are not provided, uses a "log only" fallback.
 *
 * @returns {Object|null} - Nodemailer transporter or null
 */
const createTransporter = () => {
  if (!config.smtp.host || !config.smtp.user || !config.smtp.pass) {
    return null; // SMTP not configured — will log instead of sending
  }

  return nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });
};

/**
 * Processes a contact form submission.
 * Sends an email notification if SMTP is configured,
 * otherwise logs the message to the console.
 *
 * @param {Object} contactData - The contact form data
 * @param {string} contactData.name - Sender's name
 * @param {string} contactData.email - Sender's email
 * @param {string} contactData.subject - Message subject
 * @param {string} contactData.message - Message body
 * @returns {Promise<Object>} - Result object with status info
 */
const sendContactMessage = async (contactData) => {
  const { name, email, subject, message } = contactData;

  const transporter = createTransporter();

  // Build the email content
  const mailOptions = {
    from: `"Portfolio OS Contact" <${config.smtp.user || 'noreply@portfolioos.dev'}>`,
    to: config.contactEmail,
    replyTo: email,
    subject: `[Portfolio OS] ${subject}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0078d4, #00a4ef); padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #fff; margin: 0; font-size: 20px;">📩 New Contact Message</h1>
        </div>
        <div style="background: #1e1e1e; color: #d4d4d4; padding: 24px; border-radius: 0 0 12px 12px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #60cdff; width: 80px;"><strong>From:</strong></td>
              <td style="padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #60cdff;"><strong>Email:</strong></td>
              <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #60cdff;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #60cdff;"><strong>Subject:</strong></td>
              <td style="padding: 8px 0;">${subject}</td>
            </tr>
          </table>
          <hr style="border: 1px solid #333; margin: 16px 0;" />
          <div style="white-space: pre-wrap; line-height: 1.6;">${message}</div>
        </div>
      </div>
    `,
    text: `New Contact Message\n\nFrom: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
  };

  // If SMTP is configured, send the email
  if (transporter) {
    try {
      const info = await transporter.sendMail(mailOptions);
      return {
        sent: true,
        messageId: info.messageId,
      };
    } catch (err) {
      console.error('📧 Email sending failed:', err.message);
      // Don't throw — log the message instead so the user still gets a success response
      console.log('📧 Falling back to console log for contact message');
    }
  }

  // Fallback: Log the message to console (SMTP not configured or failed)
  console.log('\n══════════════════════════════════════');
  console.log('📩 NEW CONTACT MESSAGE (logged — SMTP not configured)');
  console.log('══════════════════════════════════════');
  console.log(`  From    : ${name}`);
  console.log(`  Email   : ${email}`);
  console.log(`  Subject : ${subject}`);
  console.log(`  Message : ${message}`);
  console.log('══════════════════════════════════════\n');

  return {
    sent: false,
    messageId: null,
    note: 'SMTP not configured — message logged to console',
  };
};

module.exports = {
  sendContactMessage,
};
