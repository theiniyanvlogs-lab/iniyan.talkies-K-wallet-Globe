export default async function handler(req, res) {
  // Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  try {
    const { message } = req.body;

    // Check empty message
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Call Groq API
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "user",
              content: message,
            },
          ],
        }),
      }
    );

    // If API fails
    if (!response.ok) {
      const errText = await response.text();
      return res.status(500).json({
        error: "Groq API Error",
        details: errText,
      });
    }

    const data = await response.json();

    // Send reply back to frontend
    return res.status(200).json({
      reply: data.choices[0].message.content,
    });

  } catch (error) {
    return res.status(500).json({
      error: "Server Error",
      details: error.message,
    });
  }
}
