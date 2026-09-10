import type { Env, FetchFunc } from '../../types';

type readInput = {
	key: string;
};

const handleRead: FetchFunc = async (request, env, ctx) => {
	if (request.method !== 'GET') {
		return new Response('Method Not Allowed', { status: 405 });
	}

	const qs = new URL(request.url).searchParams;

	const key = qs.get('key');
	if (key == null || key === '') {
		return new Response('Key is required', { status: 400 });
	}

	// getを使って読み込む
	// keyは配列で複数同時に取得することもできる。
	// valueの形式も文字列以外も指定することができる。(デフォルトは文字列)
	// const value = await env.MY_KV.get(key);
	const valueWithMetadata = await env.MY_KV.getWithMetadata(key);

	if (valueWithMetadata == null) {
		return new Response(`Key not found: ${key}`, { status: 404 });
	}

	return new Response(
		JSON.stringify({
			content: valueWithMetadata.value,
			metadata: valueWithMetadata.metadata,
		}),
		{
			headers: {
				'Content-Type': 'application/json',
			},
		},
	);
};

export { handleRead };
