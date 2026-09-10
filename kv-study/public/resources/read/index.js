const kvKeyElem = document.getElementById('kvKey');
const kvContentElem = document.getElementById('kvContent');
const kvMetadataElem = document.getElementById('kvMetadata');
const readButtonElem = document.getElementById('readButton');

readButtonElem.addEventListener('click', async () => {
	const key = kvKeyElem.value;
	if (key == null || key === '') {
		alert('キーを入力してください。');
		return;
	}

	const value = await readFromKV(key);
	kvContentElem.value = value.content;
	kvMetadataElem.value = JSON.stringify(value.metadata, null, 2);
});

document.addEventListener('DOMContentLoaded', async () => {
	const params = new URLSearchParams(location.search);
	const key = params.get('key');
	if (key == null) {
		return;
	}
	kvKeyElem.value = key;
	const value = await readFromKV(key);
	kvContentElem.value = value.content;
	kvMetadataElem.value = JSON.stringify(value.metadata, null, 2);
});

async function readFromKV(key) {
	const qs = new URLSearchParams({ key });

	const resp = await fetch(`/api/read?${qs.toString()}`, {
		method: 'GET',
		credentials: 'same-origin',
	});

	if (!resp.ok) {
		if (resp.status === 404) {
			window.alert('404:' + (await resp.text()));
			return { content: '', metadata: {} };
		}
		console.error(resp.status);
		console.error(resp.headers);
		console.error(await resp.text());
		window.alert('Failed to read from KV');
		return { content: '', metadata: {} };
	}

	const data = await resp.json();
	return {
		content: data.content,
		metadata: data.metadata,
	};
}

export { readFromKV };
