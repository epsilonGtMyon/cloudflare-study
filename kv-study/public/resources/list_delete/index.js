const kvTableElem = document.getElementById('kvTable');
const kvTableBodyElem = kvTableElem.querySelector('tbody');

document.addEventListener('DOMContentLoaded', async () => {
	const resp = await fetch('/api/list', {
		method: 'GET',
		credentials: 'same-origin',
	});

	if (!resp.ok) {
		console.error(resp.status);
		console.error(resp.headers);
		console.error(await resp.text());
		window.alert('Failed to list from KV');
		return '';
	}
	const data = await resp.json();
	kvTableBodyElem.innerHTML = '';

	for (const record of data.records) {
		const tr = document.createElement('tr');

		// name
		const tdKey = document.createElement('td');
		const tdAnchor = document.createElement('a');
		tdAnchor.href = `../read?key=${encodeURIComponent(record.name)}`;
		tdAnchor.textContent = record.name;
		tdKey.appendChild(tdAnchor);
		tr.appendChild(tdKey);

		// metadata
		const tdMetadata = document.createElement('td');
		tdMetadata.textContent = JSON.stringify(record.metadata);
		tr.appendChild(tdMetadata);

		// 操作列
		const tdAction = document.createElement('td');
		const deleteButton = document.createElement('button');
		deleteButton.textContent = 'Delete';
		deleteButton.addEventListener('click', async () => {
			if (!window.confirm(`Are you sure you want to delete the key "${record.name}"?`)) {
				return;
			}

			const delResp = await fetch(`/api/delete`, {
				method: 'POST',
				credentials: 'same-origin',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					key: record.name,
				}),
			});
			if (!delResp.ok) {
				console.error(delResp.status);
				console.error(delResp.headers);
				console.error(await delResp.text());
				window.alert('Failed to delete from KV');
				return;
			}
			tr.remove();
		});
		tdAction.appendChild(deleteButton);
		tr.appendChild(tdAction);

		kvTableBodyElem.appendChild(tr);
	}
});

export {};
