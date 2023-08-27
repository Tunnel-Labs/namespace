import mapObject from "map-obj";
import { FlatNamespace, NestedNamespace } from "~/types/namespace.js";

export function createFlatNamespace<
  Prefix extends string,
  Properties extends Record<string, unknown>,
  Separator extends string = "_",
>(
  prefix: Prefix,
  properties: Properties,
  options?: { separator?: Separator }
): FlatNamespace<Prefix, Properties, Separator> {
  const separator = options?.separator ?? "_";
  return mapObject(properties, (key, value) => [
    (key as string).replace(`${prefix}${separator}`, ""),
    value,
  ]) as any;
}

export function createNestedNamespace<
  Properties extends Record<string, unknown>,
  Separator extends string = "_",
>(
  properties: Properties,
  options?: {
    separator?: Separator;
    transformProperty?(args: {
      namespace: string;
      propertyKey: string;
      property: any;
    }): void;
  }
): NestedNamespace<Properties, Separator> {
  const namespaces: Record<string, Record<string, unknown>> = {};
  const separator = options?.separator ?? "_";

  // We bind the `this` type of all library methods to the library
  for (const [propertyIdentifier, property] of Object.entries(properties)) {
    const [namespace, propertyKey] = propertyIdentifier.split(separator);
    if (namespace === undefined || propertyKey === undefined) {
      console.warn(
        "Invalid property identifier, skipping:",
        propertyIdentifier
      );
      continue;
    }

    namespaces[namespace] ??= {};
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Guaranteed to exist
    namespaces[namespace]![propertyKey] =
      options?.transformProperty === undefined
        ? property
        : options.transformProperty({
            namespace,
            propertyKey,
            property,
          });
  }

  return namespaces as any;
}
