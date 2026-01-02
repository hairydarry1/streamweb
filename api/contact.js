export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false });
  }

  const webhookURL = process.env.DISCORD_WEBHOOK_URL;

  try {
    const response = await fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content:
          `**New Contact Form Submission**\n` +
          `👤 **Name:** ${name}\n` +
          `📧 **Email:** ${email}\n` +
          `💬 **Message:** ${message}`
      })
    });

    if (!response.ok) throw new Error("Discord failed");

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
}
