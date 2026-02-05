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

          // ✅ Prevent long paragraph answers
          max_tokens: 180,
          temperature: 0.4,

          // ✅ System Prompt Forces Bullet Format
          messages: [
            {
              role: "system",
              content: `
You are a chatbot.

Strict Rules:
1. Always reply in TWO parts:

Tamil:
- point 1
- point 2
- point 3
- point 4
- point 5

English:
- point 1
- point 2
- point 3
- point 4
- point 5

2. Never write paragraph.
3. Always reply line-by-line bullets only.
4. Maximum 5 bullet points.
5. Keep answers short and easy.
              `,
            },
            {
              role: "user",
              content: message,
            },
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
