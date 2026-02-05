export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",

          // ✅ More tokens for 10 bullet answers
          max_tokens: 700,
          temperature: 0.5,

          messages: [
            {
              role: "system",
              content: `
You are a chatbot.

Strict Rules:
Tamil:
- exactly 10 bullet points (complete)

English:
- exactly 10 bullet points (complete)

Never write paragraph.
Always reply line-by-line bullets.
Always finish all 10 points.
Keep each bullet short and clear.
              `,
            },
            { role: "user", content: message },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: "Groq API Error",
        details: data,
      });
    }

    return res.status(200).json({
      reply: data.choices[0].message.content,
    });

  } catch (err) {
    return res.status(500).json({
      error: "Server Error",
      details: err.message,
    });
  }
}
