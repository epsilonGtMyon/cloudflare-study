import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { requestId } from 'hono/request-id'
import { secureHeaders } from 'hono/secure-headers'
import { csrf } from "hono/csrf";

import { sandbox01App } from './handler/sandbox01';
import { sandbox02App } from './handler/sandbox02';
import { sandbox03App } from './handler/sandbox03';

export interface MyEnv {
  // If you set another name in the Wrangler config file as the value for 'binding',
  // replace "AI" with the variable name you defined.
  Bindings: {
    AI: Ai;
  }
}



const app = new Hono()
app.use(secureHeaders())
app.use('*', requestId())
app.use(logger());
app.use(
  csrf({
    secFetchSite: ["same-origin"],
  }),
);

// -----------
app.route("/api/sandbox01", sandbox01App)
app.route("/api/sandbox02", sandbox02App)
app.route("/api/sandbox03", sandbox03App)
export default app
