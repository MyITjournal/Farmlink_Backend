import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let transporterPromise = null;

async function getTransporter() {
  if (transporterPromise) return transporterPromise;

  transporterPromise = (async () => {
    // If SMTP env vars are set, use them. Otherwise fall back to Ethereal test account.
    const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;

    if (EMAIL_HOST && EMAIL_USER) {
      return nodemailer.createTransport({
        host: EMAIL_HOST,
        port: Number(EMAIL_PORT) || 587,
        secure: false,
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS,
        },
      });
    }

    // Ethereal (for development) - test account
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  })();

  return transporterPromise;
}

/**
 * Send an email.
 * If no SMTP is configured, uses Ethereal and logs a preview URL.
 */
async function sendEmail({ to, subject, text, html, from }) {
  const transporter = await getTransporter();

  const mailOptions = {
    from: from || process.env.EMAIL_FROM || 'no-reply@farmlink.local',
    to,
    subject,
    text,
    html,
  };

  const info = await transporter.sendMail(mailOptions);

  // If using Ethereal, provide a preview URL in logs
  if (nodemailer.getTestMessageUrl && nodemailer.getTestMessageUrl(info)) {
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
  }

  return info;
}

export default { sendEmail };
