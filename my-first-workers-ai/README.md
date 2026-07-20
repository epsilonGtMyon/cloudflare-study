# my-first-workers-ai

[workers ai/](https://developers.cloudflare.com/workers-ai/)を試すよ



## Bindingの追加

wrangler.jsonc へ追加

``` jsonc
{
  "ai": {
    "binding": "AI"
  }
}
```


## 型の追加

参照できるように

```ts
export interface Env {
  // If you set another name in the Wrangler config file as the value for 'binding',
  // replace "AI" with the variable name you defined.
  AI: Ai;
}
```