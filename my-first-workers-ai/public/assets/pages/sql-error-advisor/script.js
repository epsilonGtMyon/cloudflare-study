import { useBlocking } from "../../common/blocking/blocking.js";

const causeSqlElem = document.getElementById("causeSql");
const errorMessageElem = document.getElementById("errorMessage");
const aiAnswerElem = document.getElementById("aiAnswer");
const execute1ButtonElem = document.getElementById("execute1Button");
const execute2ButtonElem = document.getElementById("execute2Button");

const { block } = useBlocking();

async function request(url) {
  const causeSql = causeSqlElem.value;
  const errorMessage = errorMessageElem.value;

  const abortController = new AbortController();

  const req = new Request(url, {
    method: "POST",
    credentials: "same-origin",
    signal: abortController.signal,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      causeSql,
      errorMessage,
    }),
  });

  const resp = await fetch(req);
  return { resp, abortController };
}

execute1ButtonElem.addEventListener("click", async () => {
  aiAnswerElem.value = "";

  const unblock = block();
  try {
    const { resp } = await request("/api/ai/sql-error-advisor");

    if (!resp.ok) {
      console.error(resp.status);
      console.error(resp.headers);
      window.alert("error");
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();

    unblock();
    let buffer = "";
    let text = "";
    while (true) {
      const r = await reader.read();
      if (r.done) {
        break;
      }

      const decoded = decoder.decode(r.value, { stream: true });
      buffer += decoded;
      // 複数行まとめて来ることがあるので split
      const lines = buffer.split("\n");
      // 最後の行は途中かもしれないので残しておく
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;

        const data = line.slice(6).trim();
        if (data === "[DONE]") {
          // 最終行
          continue;
        }

        const parsed = JSON.parse(data);
        if (parsed.choices == null || parsed.choices.length == 0) {
          // 最終行一つ手前
          continue;
        }

        const reasoningContent = parsed.choices[0].delta.reasoning_content;
        const content = parsed.choices[0].delta.content ?? "";
        text += content;

        aiAnswerElem.value = text;
        aiAnswerElem.scrollTo(0, aiAnswerElem.scrollHeight);
      }
    }
  } finally {
    unblock();
  }
});

execute2ButtonElem.addEventListener("click", async () => {
  aiAnswerElem.value = "";

  const unblock = block();
  try {
    const { resp } = await request("/api/ai/sql-error-advisor2");

    if (!resp.ok) {
      console.error(resp.status);
      console.error(resp.headers);
      window.alert("error");
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();

    unblock();
    let text = "";
    while (true) {
      const r = await reader.read();
      if (r.done) {
        break;
      }

      const decoded = decoder.decode(r.value, { stream: false });
      text += decoded;

      aiAnswerElem.value = text;
      aiAnswerElem.scrollTo(0, aiAnswerElem.scrollHeight);
    }
  } finally {
    unblock();
  }
});

causeSqlElem.value = `select
  em.emp_no
  ,em.emp_name2
from
  sam_emp em
left outer join
  sam_emp_dept ed
on (em.emp_no = ed.emp_no)
left outer join
  sam_dept d
on (ed.dept_no = d.dept_no)
`;

errorMessage.value = `column em.emp_name2 does not exist
`;

export {};
