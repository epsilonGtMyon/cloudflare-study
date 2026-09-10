interface Env {
	MY_KV: KVNamespace;
}

type FetchFunc = NonNullable<ExportedHandler<Env>['fetch']>;

export type { Env, FetchFunc };
