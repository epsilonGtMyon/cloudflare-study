/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { handleSandbox01 } from "./sandbox01";
import {
  handleSqlErrorAdvisor,
  handleSqlErrorAdvisor2,
} from "./sql-error-advisor";

export interface Env {
  // If you set another name in the Wrangler config file as the value for 'binding',
  // replace "AI" with the variable name you defined.
  AI: Ai;
}

export type FetchFunc = NonNullable<ExportedHandler<Env>["fetch"]>;

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url);
    switch (url.pathname) {
      case "/api/sandbox01/helloAi": {
        return handleSandbox01(request, env, ctx);
      }
      case "/api/ai/sql-error-advisor": {
        return handleSqlErrorAdvisor(request, env, ctx);
      }
      case "/api/ai/sql-error-advisor2": {
        return handleSqlErrorAdvisor2(request, env, ctx);
      }
      default:
        return new Response("Not Found", { status: 404 });
    }
  },
} satisfies ExportedHandler<Env>;
