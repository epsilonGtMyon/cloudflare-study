import { useBlocking } from "../../common/blocking/blocking.js";

const userInputElem = document.getElementById("userInput");
const helloAiButtonElem = document.getElementById("helloAiButton");
const aiAnswerElem = document.getElementById("aiAnswer");

const { withBlocking } = useBlocking();

helloAiButtonElem.addEventListener("click", async () => {
  const userInput = userInputElem.value;
  aiAnswerElem.value = "";

  await withBlocking(async () => {
    const abortController = new AbortController();

    const req = new Request("/api/sandbox01/helloAi", {
      method: "POST",
      credentials: "same-origin",
      signal: abortController.signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        userInput: userInput,
      }),
    });

    const resp = await fetch(req);
    if (!resp.ok) {
      console.error(resp.status);
      console.error(resp.headers);
      window.alert("error");
      return;
    }

    const body = await resp.json();
    aiAnswerElem.value = body.reply;
  });
});

userInputElem.value = "おはようございます。";
export {};
