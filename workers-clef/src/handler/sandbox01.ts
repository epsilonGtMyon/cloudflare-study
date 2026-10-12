import { Hono } from "hono";
import { type MyEnv } from "..";

const sandbox01App = new Hono<MyEnv>();

sandbox01App.post("/gen1", async (c) => {
  const param = await c.req.json();

  const response = await c.env.AI.run("@cf/cloudflare/clef-flash", {
    model: "clef-flash",
    state: "次のユーザーの質問に対して回答してください。",
    questions: {
      question1: {
        type: "noul",
        instructions: param.message,
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
    noul: question1.noul,
  });
});

export { sandbox01App };
