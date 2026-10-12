import { Hono } from "hono";
import { type MyEnv } from "..";

const imageSandbox01App = new Hono<MyEnv>();

imageSandbox01App.post("/gen1", async (c) => {
  const param = await c.req.json();

  const response = await c.env.AI.run("@cf/cloudflare/clef-flash", {
    model: "clef-flash",
    state: "添付された画像がどのようなものかを評価してください。",
    questions: {
      question1: {
        type: "choice",
        instructions: "この画像が選択肢のどれに該当するかを選んでください。",
        criteria: {
          dog: "犬の画像である",
          cat: "猫の画像である",
          human: "人間の画像である",
          other: "犬でも猫でもない画像である",
        },
      },
    },
    images: [param.imageDataURL],
  });

  const question1 = (response.answers as any).question1;

  return c.json({
    choice: question1.choice,
    probabilities: question1.probabilities,
    confidence: question1.confidence,
  });
});

export { imageSandbox01App };
