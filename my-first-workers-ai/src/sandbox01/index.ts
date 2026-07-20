import { type FetchFunc } from "../index";

type AiInput = {
  userInput: string;
};

// 一般的な用途だとこれが 速そう
const modelBasic = "@cf/openai/gpt-oss-20b";

// gemmaはオーバースペック感がある。あと時間かかる..
// const modelBasic = "@cf/google/gemma-4-26b-a4b-it"

const handleSandbox01: FetchFunc = async (request, env, ctx) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const input = await request.json<Partial<AiInput>>();

  const response = await env.AI.run(modelBasic, {
    messages: [
      {
        role: "system",
        content: "あなたは私の友達です。挨拶を日本語で返してください。",
      },
      {
        role: "user",
        content: input.userInput ?? "",
      },
    ],
  });

  return new Response(
    JSON.stringify({
      reply: response.choices![0].message.content,
    }),
    {
      headers: { "content-type": "application/json" },
    },
  );
};

export { handleSandbox01 };
