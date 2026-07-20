import { type FetchFunc, type Env } from "../index";

type AiAqlErrorAdvisorInput = {
  causeSql: string;
  errorMessage: string;
};

const modelCode = "@cf/qwen/qwen3-30b-a3b-fp8";

/**
 * AIに問い合わせる。
 *
 * @param request
 */
async function askAi(
  input: AiAqlErrorAdvisorInput,
  env: Parameters<FetchFunc>[1],
) {
  const userPrompt = `
## 原因となったSQL文

${input.causeSql}

## エラーメッセージ

${input.errorMessage}
              `;

  const response = await env.AI.run(modelCode, {
    stream: true,
    messages: [
      {
        role: "system",
        content: `あなたはPostgreSQLのプロです。
 これからエラーとなったSQL文、エラーメッセージ、関連テーブル情報(もしあれば)を提示するので
 原因を提示してください。
 原因箇所を示す際は何行目であるかをつけてください。
 また可能であれば、解決案も提示してください。

 以下のルールは守ってください。
 - 返事は日本語で返してください。
 - わからない場合はわからないと答えてください。
 - 回答はプレーンテキストで提示してください。マークダウンやJSONは禁止です。
 - ユーザーはSQLエディタのみを利用しており、psqlを利用することはできません。
`,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
  });

  return response;
}

/**
 * AIに訪ねてストリームでレスポンスを返す。
 * @param request
 * @param env
 * @param ctx
 * @returns
 */
const handleSqlErrorAdvisor: FetchFunc = async (request, env, ctx) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  const input = await request.json<Partial<AiAqlErrorAdvisorInput>>();
  if ((input.causeSql ?? "") === "" || (input.errorMessage ?? "") === "") {
    return new Response("Bad Request", { status: 400 });
  }

  const response = await askAi(
    input as NonNullable<AiAqlErrorAdvisorInput>,
    env,
  );

  return new Response(response, {
    headers: { "content-type": "text/event-stream" },
  });
};

/**
 * AIに訪ねてストリームでレスポンスを返す。
 * こっちは AIのレスポンスをサーバー側で加工する。
 *
 * @param request
 * @param env
 * @param ctx
 * @returns
 */
const handleSqlErrorAdvisor2: FetchFunc = async (request, env, ctx) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  const input = await request.json<Partial<AiAqlErrorAdvisorInput>>();
  if ((input.causeSql ?? "") === "" || (input.errorMessage ?? "") === "") {
    return new Response("Bad Request", { status: 400 });
  }

  const response = await askAi(
    input as NonNullable<AiAqlErrorAdvisorInput>,
    env,
  );

  // ------
  // レスポンスの加工

  const textDecoder = new TextDecoder();
  let buffer = "";
  const transformStream = new TransformStream({
    transform(chunk, controller) {
      const decoded = textDecoder.decode(chunk, { stream: true });
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

        const reasoning = parsed.choices[0].delta.reasoning;
        if (reasoning != null) {
          // 考え中の情報
          continue;
        }

        const content = parsed.choices[0].delta.content ?? "";
        controller.enqueue(content);
      }
    },
  });

  return new Response(response.pipeThrough(transformStream), {
    headers: { "content-type": "text/event-stream" },
  });
};

export { handleSqlErrorAdvisor, handleSqlErrorAdvisor2 };
