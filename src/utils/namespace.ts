import mapObject from 'map-obj';

export function defineNamespace<
	Prefix extends string,
	NamespaceMethods extends Record<string, unknown>
>(
	prefix: Prefix,
	namespaceMethods: NamespaceMethods
): {
	[K in keyof NamespaceMethods as K extends `${Prefix}_${infer MethodName}`
		? MethodName
		: K]: NamespaceMethods[K];
} {
	return mapObject(namespaceMethods, (key, value) => [
		(key as string).replace(`${prefix}_`, ''),
		value
	]) as any;
}
