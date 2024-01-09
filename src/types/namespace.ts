import type { IsNever, UnionToIntersection } from "type-fest";

type OverridePropertyKeys<
  $Properties,
  $OverrideSuffix extends string,
> = keyof $Properties & `${string}${$OverrideSuffix}`;

// prettier-ignore
type PropertiesWithOverride<$Properties, $OverrideSuffix extends string> = Omit<
  $Properties,
  IsNever<OverridePropertyKeys<$Properties, $OverrideSuffix>> extends true ?
		never :
	OverridePropertyKeys<$Properties, $OverrideSuffix> extends `${infer $KeyToOverride}${$OverrideSuffix}` ?
		$KeyToOverride :
	never
> & {
  [
		K in OverridePropertyKeys<$Properties, $OverrideSuffix> as
			K extends `${infer $KeyToOverride}${$OverrideSuffix}` ?
				$KeyToOverride :
    	never
	]: K extends keyof $Properties ? $Properties[K] : never;
};

export type NestedNamespace<
  $Properties,
  $Separator extends string = "_",
  $OverrideSuffix extends string = "$",
> = UnionToIntersection<
  {
    [K in keyof PropertiesWithOverride<$Properties, $OverrideSuffix>]: {
      [Key in K extends `${infer $Namespace}${$Separator}${string}`
        ? $Namespace
        : never]: {
        [Key in K extends `${string}${$Separator}${infer $MethodName}`
          ? $MethodName
          : never]: PropertiesWithOverride<$Properties, $OverrideSuffix>[K];
      };
    };
  }[keyof PropertiesWithOverride<$Properties, $OverrideSuffix>]
>;

export type FlatNamespace<
  Prefix extends string,
  Properties,
  Separator extends string = "_",
> = {
  [K in keyof Properties as K extends `${Prefix}${Separator}${infer MethodName}`
    ? MethodName
    : K]: Properties[K];
};
