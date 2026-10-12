import { Hono } from "hono";
import { type MyEnv } from "..";

const sandbox03App = new Hono<MyEnv>();

sandbox03App.post("/gen1", async (c) => {
  const param = await c.req.json();

  const response = await c.env.AI.run("@cf/cloudflare/clef-flash", {
    model: "clef-flash",
    state: "ユーザーが入力したものの大きさを評価してください。",
    questions: {
      question1: {
        type: "score",
        instructions: param.message,

        criteria: [
          "0: 細菌くらいの大きさ",
          "1: アリくらいの大きさ",
          "2: 小動物くらいの大きさ",
          "3: 人間くらいの大きさ",
          "4: 建物くらいの大きさ",
          "5: 国くらいの大きさ",
          "6: 太陽や地球などの天体くらいの大きさ",
        ],
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
    score: question1.score,
    legend: question1.legend,
    probabilities: question1.probabilities,
    confidence: question1.confidence,
  });
});

export { sandbox03App };
