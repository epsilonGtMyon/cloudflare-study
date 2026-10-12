const gen1ButtonElem = document.getElementById("gen1Button");

const messageElem = document.getElementById("message");
const resultMessageElem = document.getElementById("resultMessage");

const API_PREFIX = "/api/sandbox02";

document.addEventListener("DOMContentLoaded", () => {
  messageElem.value = Math.random() < 0.5 ? `データベースからデータを取り出す。` : `ユーザーが入力したデータの入力チェック。`;
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

  resultMessageElem.textContent = `Choice(選ばれたもの): ${data.choice}

Confidence("自信度"): ${data.confidence}
Probabilities("選択肢ごとの確率"): ${JSON.stringify(data.probabilities, null, 2)}
`;
});
