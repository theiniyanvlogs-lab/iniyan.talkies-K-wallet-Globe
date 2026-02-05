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

          // ✅ Very high token limit for full answers
          max_tokens: 2000,
          temperature: 0.6,

          messages: [
            {
              role: "system",
              content: `
You are a helpful chatbot.

Reply Rules:
1. Always reply in TWO parts:

Tamil:
- Give full detailed answer in bullet steps.

English:
- Give full detailed answer in bullet steps.

2. Do not stop until the answer is complete.
3. Use as many bullet points as needed.
4. Do NOT give short/incomplete replies.
5. Keep answers structured like:

Tamil:
- Ingredients
- Steps
- Tips

English:
- Ingredients
- Steps
- Tips
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
