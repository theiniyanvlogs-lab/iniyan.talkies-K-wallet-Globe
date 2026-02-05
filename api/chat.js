export default async function handler(req, res) {
  // Only POST allowed
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Only POST requests allowed",
    });
  }

  try {
    const { message } = req.body;

    // Validate message
    if (!message || message.trim() === "") {
      return res.status(400).json({
        error: "Message is required",
      });
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
          model: "mixtral-8x7b-32768",
          temperature: 0.7,
          messages: [
            {
              role: "user",
              content: message,
            },
          ],
        }),
      }
    );

    // Read JSON safely
    const data = await response.json();

    // If Groq returns error
    if (!response.ok) {
      return res.status(500).json({
        error: "Groq API Error",
        details: data,
      });
    }

    // If no reply returned
    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({
        error: "No response from Groq",
        full: data,
      });
    }

    // Send reply back
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
