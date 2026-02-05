async function sendMessage() {
  let input = document.getElementById("userInput");
  let msg = input.value.trim();
  if (msg === "") return;

  let chatBox = document.getElementById("chatBox");

  // Show user message
  chatBox.innerHTML += `
    <div class="msg user">${msg}</div>
  `;

  input.value = "";

  // Bot placeholder
  let botDiv = document.createElement("div");
  botDiv.className = "msg bot";
  botDiv.innerHTML = `<p class="eng">Thinking...</p>`;
  chatBox.appendChild(botDiv);

  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    // Call backend API
    let response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: msg })
    });

    let data = await response.json();

    // If API error
    if (data.error) {
      botDiv.innerHTML = `<p class="eng">Error: ${data.error}</p>`;
      console.log("API Error Full:", data);
      return;
    }

    // If reply missing
    if (!data.reply) {
      botDiv.innerHTML = `<p class="eng">No reply received</p>`;
      console.log("No reply:", data);
      return;
    }

    let replyText = data.reply;

    // Split Tamil + English parts
    let tamil = "";
    let english = "";

    if (replyText.includes("English:")) {
      tamil = replyText.split("English:")[0].replace("Tamil:", "").trim();
      english = replyText.split("English:")[1].trim();
    } else {
      tamil = replyText;
    }

    // Show reply with proper line breaks
    botDiv.innerHTML = `
      <p class="tamil">${tamil.replace(/\n/g, "<br>")}</p>
      <p class="eng">${english.replace(/\n/g, "<br>")}</p>
    `;

  } catch (err) {
    botDiv.innerHTML = `<p class="eng">Server not responding</p>`;
    console.log("Fetch Error:", err);
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}

/* Clear Chat Button Function */
function clearChat() {
  document.getElementById("chatBox").innerHTML = "";
}
