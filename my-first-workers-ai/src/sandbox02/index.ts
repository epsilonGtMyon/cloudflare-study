import { type FetchFunc } from '../index';

type UserInput = {
	userInput: string;
	imageSize: string;
};

// 商用利用できそうなやつ(ほんと？)
const model = '@cf/black-forest-labs/flux-2-klein-4b';

const imageSizeMap: Record<string, { width: number; height: number }> = {
	'1': { width: 256, height: 256 },
	'2': { width: 512, height: 512 },
	'3': { width: 1024, height: 1024 },
};

const handleSandbox02: FetchFunc = async (request, env, ctx) => {
	if (request.method !== 'POST') {
		return new Response('Method Not Allowed', { status: 405 });
	}

	const input = await request.json<Partial<UserInput>>();
	if (input.userInput == null || input.userInput.trim() === '') {
		return new Response('Bad Request', { status: 400 });
	}
	if (!['0', '1', '2', '3'].includes(input.imageSize ?? '')) {
		return new Response('Bad Request', { status: 400 });
	}

	// 使い方
	// https://developers.cloudflare.com/changelog/post/2026-01-15-flux-2-klein-4b-workers-ai/
	// flux のリファレンス
	// https://docs.bfl.ai/api-reference/models/generate-or-edit-an-image-with-flux2-[flex]

	const form = new FormData();
	form.append('prompt', input.userInput);
	if (input.imageSize !== '0') {
		const { width, height } = imageSizeMap[input.imageSize!];
		form.append('width', width.toString());
		form.append('height', height.toString());
	}

	// FormData doesn't expose its serialized body or boundary. Passing it to a
	// Request (or Response) constructor serializes it and generates the Content-Type
	// header with the boundary, which is required for the server to parse the multipart fields.
	const formResponse = new Response(form);
	const formStream = formResponse.body!;
	const formContentType = formResponse.headers.get('content-type')!;

	const resp = await env.AI.run(model, {
		multipart: {
			body: formStream,
			contentType: formContentType,
		},
	});

	// resp.imageにはBASE64エンコードされた画像データが入っている。
	// ここではdata URIスキームに変換して返す。
	const dataUri = `data:image/png;base64,${resp.image}`;

	return new Response(dataUri, {
		headers: { 'content-type': 'image/png' },
	});
};

export { handleSandbox02 };
