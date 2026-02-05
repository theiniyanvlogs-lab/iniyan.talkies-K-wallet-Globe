async function sendMessage() {
  let input = document.getElementById("userInput");
  let msg = input.value.trim();
  if (msg === "") return;

  let chatBox = document.getElementById("chatBox");

  // Show user message
  chatBox.innerHTML += `
    <div class="msg user">
      ${msg}
    </div>
  `;

  input.value = "";

  // Create bot placeholder
  let botDiv = document.createElement("div");
  botDiv.className = "msg bot";
  botDiv.innerHTML = `<p class="eng">Thinking...</p>`;
  chatBox.appendChild(botDiv);

  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    // Call backend API (Vercel serverless function)
    let response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: msg })
    });

    let data = await response.json();

    // Show AI reply
    botDiv.innerHTML = `
      <p class="eng">${data.reply}</p>
    `;
  } catch (error) {
    botDiv.innerHTML = `
      <p class="eng">Error: API not working</p>
    `;
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}
