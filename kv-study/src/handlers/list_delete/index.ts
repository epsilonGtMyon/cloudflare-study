import type { Env, FetchFunc } from '../../types';

type deleteInput = {
	key: string;
};

const handleList: FetchFunc = async (request, env: Env) => {
	if (request.method !== 'GET') {
		return new Response('Method Not Allowed', { status: 405 });
	}

	// listで取得する。
	// オプションで件数とかカーソルとか絞り込みのprefixなどがあるみたい
	const list = await env.MY_KV.list();

	return new Response(
		JSON.stringify({
			records: list.keys.map((k) => ({ name: k.name, expiration: k.expiration, metadata: k.metadata })),
		}),
		{ status: 200 },
	);
};

const handleDelete: FetchFunc = async (request, env: Env) => {
	if (request.method !== 'POST') {
		return new Response('Method Not Allowed', { status: 405 });
	}

	const req = await request.json<Partial<deleteInput>>();

	if (req.key == null || req.key.length === 0) {
		return new Response('Key is required', { status: 400 });
	}

	await env.MY_KV.delete(req.key);

	return new Response('Deleted', { status: 200 });
};

export { handleList, handleDelete };
