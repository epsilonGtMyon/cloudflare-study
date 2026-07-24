import { useBlocking } from '../../common/blocking/blocking.js';

const userInputElem = document.getElementById('userInput');
const imageSizeElem = document.getElementById('imageSize');
const executeButtonElem = document.getElementById('executeButton');
const resultElem = document.getElementById('result');

const { block, unblock, withBlocking } = useBlocking();

executeButtonElem.addEventListener('click', async () => {
	const userInput = userInputElem.value;
	const imageSize = imageSizeElem.value;
	while (resultElem.firstChild) {
		resultElem.removeChild(resultElem.firstChild);
	}

	await withBlocking(async () => {
		const abortController = new AbortController();

		const req = new Request('/api/sandbox02/generateImage', {
			method: 'POST',
			credentials: 'same-origin',
			signal: abortController.signal,
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userInput: userInput,
				imageSize: imageSize,
			}),
		});

		const resp = await fetch(req);
		if (!resp.ok) {
			console.error(resp.status);
			console.error(resp.headers);
			window.alert('error');
			// エラーの内容で画面を差し替える
			document.body.innerHTML = await resp.text();
			return;
		}

		const base64DataUri = await resp.text();

		const imgElem = document.createElement('img');
		imgElem.src = base64DataUri;

		resultElem.appendChild(imgElem);
	});
});

userInputElem.value = `
サモエド2匹が雪景色の中を楽しそうに走っている
そのサモエドの後ろには1匹のハスキー犬が追いかけている
`;
imageSizeElem.value = '2';
