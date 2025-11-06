import dotenv from 'dotenv';

dotenv.config();

/**
 * sendSms - lightweight SMS sender placeholder
 * If you integrate a provider (e.g., Twilio), replace this implementation.
 * The function returns a promise to mirror real SDKs.
 */
async function sendSms({ to, message }) {
  // If environment variables for a real provider exist, you'd implement
  // real sending here (e.g., using Twilio SDK). For now, log and resolve.
  console.log(`SMS to ${to}: ${message}`);

  return Promise.resolve({ success: true, to, message });
}

export default { sendSms };
