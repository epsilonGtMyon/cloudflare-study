const gen1ButtonElem = document.getElementById("gen1Button");

const messageElem = document.getElementById("message");
const resultMessageElem = document.getElementById("resultMessage");

const API_PREFIX = "/api/sandbox03";

document.addEventListener("DOMContentLoaded", () => {
  const randomValue = Math.random();

  if (randomValue < 0.2) {
    messageElem.value = `コロナウィルス`;
  } else if (randomValue < 0.4) {
    messageElem.value = `リンゴという果物`;
  } else if (randomValue < 0.6) {
    messageElem.value = `ゴリラという大型の霊長類`;
  } else if (randomValue < 0.8) {
    messageElem.value = `東京タワーという日本の東京にある建造物`;
  } else {
    messageElem.value = `太陽という太陽系の星`;
  }
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
  console.log();

  resultMessageElem.textContent = `
Score(スコア): ${data.score}

Confidence("自信度"): ${data.confidence}
Legend("凡例"): ${JSON.stringify(data.legend, null, 2)}
Probabilities("選択肢ごとの確率"): ${JSON.stringify(data.probabilities, null, 2)}
`;
});
