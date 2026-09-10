import { randomUUID } from 'crypto';
import type { Env, FetchFunc } from '../../types';

type writeInput = {
	content: string;
	ttlSeconds?: string;
};

const maxTTLSeconds = 60 * 60 * 24 * 7;

const handleWrite: FetchFunc = async (request, env, ctx) => {
	if (request.method !== 'POST') {
		return new Response('Method Not Allowed', { status: 405 });
	}

	const req = await request.json<Partial<writeInput>>();

	if (req.content == null || req.content.length === 0) {
		return new Response('Content is required', { status: 400 });
	}
	if (req.content.length > 20000) {
		return new Response('Content exceeds maximum allowed length', { status: 400 });
	}

	if (req.ttlSeconds != null) {
		if (!/^[0-9]*$/.test(req.ttlSeconds) || req.ttlSeconds.length > 7) {
			return new Response('Invalid TTL', { status: 400 });
		}
		const ttlSeconds = parseInt(req.ttlSeconds);

		if (ttlSeconds < 60 || maxTTLSeconds < ttlSeconds) {
			return new Response('TTL exceeds maximum allowed value', { status: 400 });
		}
	}

	// ------------------------

	const generatedKey = crypto.randomUUID();

	const option: KVNamespacePutOptions = {
		metadata: {
			createdAt: Date.now(),
		},
	};
	if (req.ttlSeconds != null && req.ttlSeconds !== '') {
		option.expirationTtl = parseInt(req.ttlSeconds);
	}

	// putを使って書き込む
	// 第3引数にはオプションを渡す
	await env.MY_KV.put(generatedKey, req.content, option);

	return new Response(
		JSON.stringify({
			generatedKey,
		}),
		{
			headers: {
				'Content-Type': 'application/json',
			},
		},
	);
};

export { handleWrite };
