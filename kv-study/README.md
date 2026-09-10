# kv-study

## Bindingの追加

`wrangler.jsonc`


```jsonc
	"kv_namespaces": [
		{
			"binding": "MY_KV",
			"id": "<BINDING_ID>"
		}
	]
```

コードからは `env.MY_KV` で参照できる。

## 型の追加

参照できるように

```ts

interface Env {
	MY_KV: KVNamespace;
	// ... other binding types
}

```

## コマンド周り

[wranglerのKV](https://developers.cloudflare.com/kv/reference/kv-commands/)コマンドで作成

### namespaceの作成

```
npx wrangler kv namespace create MY_KV
```

### namespaceの削除

```
npx wrangler kv namespace delete MY_KV
```


## 実装周り


[Read key-value pairs](https://developers.cloudflare.com/kv/api/read-key-value-pairs/) を参照

