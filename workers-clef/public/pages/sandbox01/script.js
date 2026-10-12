const gen1ButtonElem = document.getElementById("gen1Button");

const messageElem = document.getElementById("message");
const resultMessageElem = document.getElementById("resultMessage");

const API_PREFIX = "/api/sandbox01";

document.addEventListener("DOMContentLoaded", () => {
  messageElem.value = `東京は大阪より東にありますか？`;
});

gen1ButtonElem.addEventListener("click", async () => {
  resultMessageElem.textContent = "";

  const message = messageElem.value;
  const response = await fetch(`${API_PREFIX}/gen1`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: message,
    }),
  });
  const data = await response.json();
  
  let resultMessage = (data.noul > 0.5 ? "はい、そうです。" : "いいえ、そうではありません。") 
  resultMessage += `その質問が正しい可能性は ${Math.floor(data.noul * 1000) / 10 }% です。`;

  resultMessageElem.textContent = resultMessage;
});
