import renameFunction from 'rename-fn';

export function createNamespaceProxy(
	getNamespaces: () => any,
	target: any,
	functionPath: string[],
): any {
	const noop = () => {};
	renameFunction(noop, functionPath.join('.'));
	const proxy: unknown = new Proxy(noop, {
		get(_obj, key) {
			if (target[key] !== undefined) {
				return target[key];
			}

			return createNamespaceProxy(getNamespaces, target, [
				...functionPath,
				key as string,
			]);
		},
		apply(_1, _2, args) {
			const namespaces = getNamespaces();

			let namespace = namespaces;
			for (const key of functionPath) {
				namespace = namespace[key];
			}

			if (typeof namespace !== 'function') {
				throw new TypeError(
					`Expected ${functionPath.join('.')} to be a function`,
				);
			}

			return namespace.apply(
				createNamespaceProxy(getNamespaces, target, []),
				args,
			);
		},
	});

	return proxy;
}