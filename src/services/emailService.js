import nodemailer from "nodemailer";
import config from "../config/index.js";

let transporterPromise = null;

async function getTransporter() {
  if (transporterPromise) return transporterPromise;

  transporterPromise = (async () => {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;

    if (SMTP_HOST && SMTP_USER) {
      return nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT) || 587,
        secure: Number(SMTP_PORT) === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
      });
    }

    // Ethereal fallback
    const testAccount = await nodemailer.createTestAccount();
    console.warn("Using Ethereal SMTP for email previews (development).");
    return nodemailer.createTransport({ host: "smtp.ethereal.email", port: 587, auth: { user: testAccount.user, pass: testAccount.pass } });
  })();

  return transporterPromise;
}

async function sendEmail({ to, subject, text, html, from }) {
  try {
    const transporter = await getTransporter();
    const mailOptions = { from: from || process.env.EMAIL_FROM || "no-reply@farmlink.com", to, subject, text, html };
    const info = await transporter.sendMail(mailOptions);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) console.log("Email preview:", previewUrl);
    return info;
  } catch (err) {
    console.error("Email send failed:", err.message);
    throw err;
  }
}

export default { sendEmail };
