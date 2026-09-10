const kvContentElem = document.getElementById('kvContent');
const kvTTLSecondsElem = document.getElementById('kvTTLSeconds');
const writeButtonElem = document.getElementById('writeButton');
const generatedKeyElem = document.getElementById('generatedKey');
const toReadPageButtonElem = document.getElementById('toReadPageButton');

let generatedKey = '';

writeButtonElem.addEventListener('click', async () => {
	generatedKey = '';
	generatedKeyElem.textContent = generatedKey;
	const kvContent = kvContentElem.value;
	const kvTTLSeconds = kvTTLSecondsElem.value;

	if (!/^[0-9]*$/.test(kvTTLSeconds)) {
		alert('TTLは数値で入力してください');
		return;
	}

	const resp = await fetch('/api/write', {
		method: 'POST',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			content: kvContent,
			ttlSeconds: kvTTLSeconds,
		}),
	});

	if (!resp.ok) {
		console.error(resp.status);
		console.error(resp.headers);
		console.error(await resp.text());
		window.alert('error');
		return;
	}

	const body = await resp.json();
	generatedKey = body.generatedKey;
	generatedKeyElem.textContent = generatedKey;
});

toReadPageButtonElem.addEventListener('click', () => {
	if (generatedKey == '') {
		alert('生成されたキーがありません');
		return;
	}
	const param = new URLSearchParams({ key: generatedKey }).toString();
	window.location.href = `../read?${param}`;
});

export {};
