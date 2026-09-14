import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // If SMTP host and auth are configured in .env, send real email
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: `"${process.env.FROM_NAME || 'SARAL Industrial Single-Window'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
        to,
        subject,
        text,
        html,
      });

      console.log(`[Email] Dispatched email to ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } else {
      // In development, log the email to the console cleanly
      console.log('──────────────────────────────────────────────────────────');
      console.log(`[DEV Email Simulator] To: ${to}`);
      console.log(`[DEV Email Simulator] Subject: ${subject}`);
      console.log(`[DEV Email Simulator] Body:\n${text || html}`);
      console.log('──────────────────────────────────────────────────────────');
      return { success: true, isDevSimulated: true };
    }
  } catch (error) {
    console.error(`[Email] Delivery Error to ${to}:`, error.message);
    // Return gracefully so user registration is not blocked if email server is unreachable
    return { success: false, error: error.message };
  }
};

export default sendEmail;
