import { Hono } from "hono";
import { type MyEnv } from "..";

const sandbox02App = new Hono<MyEnv>();

sandbox02App.post("/gen1", async (c) => {
  const param = await c.req.json();

  const response = await c.env.AI.run("@cf/cloudflare/clef-flash", {
    model: "clef-flash",
    state: "Webアプリケーションを作っています。これからの質問はフロントエンド、バックエンドどちらで実装するべき？両方？どちらでもない場合などを教えてください。",
    questions: {
      question1: {
        type: "choice",
        instructions: param.message,

        criteria: {
          "frontend":
            "フロントエンド側で実装すべきもの, js, css, html などを使う",
          "backend":
            "バックエンド側で実装すべきもの, node, python,java などを使う",
          "both": "フロントエンド側とバックエンド側の両方で実装すべきもの",
          "none": "どちらでもない場合",
        },
      },
    },
  });

  console.log({
    request: {
      message: param.message,
    },
    response: response,
  });

  const question1 = (response.answers as any).question1;

  return c.json({
    choice: question1.choice,
    probabilities: question1.probabilities,
    confidence: question1.confidence,
  });
});

export { sandbox02App };
