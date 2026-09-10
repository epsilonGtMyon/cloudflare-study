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

import { Env } from './types';
import { handleWrite } from './handlers/write';
import { handleRead } from './handlers/read';
import { handleList, handleDelete } from './handlers/list_delete';

// readStudy
// writeStudy
// deleteStudy
// listKeysStudy

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		switch (url.pathname) {
			case '/api/write': {
				return handleWrite(request, env, ctx);
			}
			case '/api/read': {
				return handleRead(request, env, ctx);
			}
			case '/api/list': {
				return handleList(request, env, ctx);
			}
			case '/api/delete': {
				return handleDelete(request, env, ctx);
			}
			default: {
				return new Response('Hello World!');
			}
		}
	},
} satisfies ExportedHandler<Env>;
