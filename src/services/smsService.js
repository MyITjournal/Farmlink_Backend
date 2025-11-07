import fetch from "node-fetch";

const sendSms = async ({ to, message }) => {
  const { SMS_PROVIDER, TERMII_API_KEY, TERMII_SENDER_ID, TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE } = process.env;

  try {
    if (SMS_PROVIDER === "termii" && TERMII_API_KEY) {
      const res = await fetch("https://api.ng.termii.com/api/sms/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, from: TERMII_SENDER_ID, sms: message, type: "plain", channel: "generic", api_key: TERMII_API_KEY }),
      });
      const data = await res.json();
      return { success: true, provider: "termii", response: data };
    }

    if (SMS_PROVIDER === "twilio" && TWILIO_SID && TWILIO_AUTH_TOKEN) {
      const twilio = await import("twilio");
      const client = twilio.default(TWILIO_SID, TWILIO_AUTH_TOKEN);
      const result = await client.messages.create({ body: message, from: TWILIO_PHONE, to });
      return { success: true, provider: "twilio", response: result };
    }

    console.log(`SMS (dev) to ${to}: ${message}`);
    return { success: true, provider: "dev", message };
  } catch (err) {
    console.error("SMS failed:", err.message);
    return { success: false, error: err.message };
  }
};

export default { sendSms };
