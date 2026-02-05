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

  // BOT Reply Placeholder
  chatBox.innerHTML += `
    <div class="msg bot">
      <p class="eng">Thinking...</p>
    </div>
  `;

  chatBox.scrollTop = chatBox.scrollHeight;

  // Later: Connect Grok API here
}
