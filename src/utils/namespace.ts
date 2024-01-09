import mapObject from "map-obj";
import { FlatNamespace, NestedNamespace } from "~/types/namespace.js";

export function createFlatNamespace<
  $Prefix extends string,
  $Properties extends Record<string, unknown>,
  $Separator extends string = "_",
>(
  prefix: $Prefix,
  properties: $Properties,
  options?: {
    separator?: $Separator;
    transformProperty?(args: { propertyKey: string; property: any }): any;
  }
): FlatNamespace<$Prefix, $Properties, $Separator> {
  const separator = options?.separator ?? "_";
  return mapObject(properties, (key, property) => {
    const propertyKey = (key as string).replace(`${prefix}${separator}`, "");
    return [
      propertyKey,
      options?.transformProperty === undefined
        ? property
        : options.transformProperty({
            propertyKey,
            property,
          }),
    ];
  }) as any;
}

export function createNestedNamespace<
  $Properties extends Record<string, unknown>,
  $Separator extends string = "_",
  $OverrideSuffix extends string = "$",
>(
  properties: $Properties,
  options?: {
    separator?: $Separator;
    overrideSuffix?: $OverrideSuffix;
    transformProperty?(args: {
      namespace: string;
      propertyKey: string;
      property: any;
    }): any;
  }
): NestedNamespace<$Properties, $Separator, $OverrideSuffix> {
  const namespaces: Record<string, Record<string, unknown>> = {};
  const separator = options?.separator ?? "_";
  const overrideSuffix = options?.overrideSuffix ?? "$";

  const propertyIdentifiers = Object.keys(properties).sort((p1, p2) => {
    // Sort properties that end in the override suffix to the beginning
    const p1EndsWithOverrideSuffix = p1.endsWith(overrideSuffix);
    const p2EndsWithOverrideSuffix = p2.endsWith(overrideSuffix);

    if (p1EndsWithOverrideSuffix && !p2EndsWithOverrideSuffix) {
      return -1;
    }
    if (!p1EndsWithOverrideSuffix && p2EndsWithOverrideSuffix) {
      return 1;
    }

    return 0;
  });

  for (const propertyIdentifier of propertyIdentifiers) {
    // We bind the `this` type of all library methods to the library
    let [namespace, propertyKey] = propertyIdentifier.split(separator);
    const property = properties[propertyIdentifier];
    if (propertyKey?.endsWith(overrideSuffix)) {
      propertyKey = propertyKey.slice(0, -overrideSuffix.length);
    }

    if (namespace === undefined || propertyKey === undefined) {
      console.warn(
        "Invalid property identifier, skipping:",
        propertyIdentifier
      );
      continue;
    }

    namespaces[namespace] ??= {};
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Guaranteed to exist
    if (namespaces[namespace]![propertyKey] === undefined) {
      namespaces[namespace]![propertyKey] =
        options?.transformProperty === undefined
          ? property
          : options.transformProperty({
              namespace,
              propertyKey,
              property,
            });
    }
  }

  return namespaces as any;
}
