import { UnionToIntersection } from "type-fest";

export type NestedNamespace<
  Properties,
  Separator extends string = "_",
> = UnionToIntersection<
  {
    [K in keyof Properties]: {
      [Key in K extends `${infer Namespace}${Separator}${string}`
        ? Namespace
        : never]: {
        [Key in K extends `${string}${Separator}${infer MethodName}`
          ? MethodName
          : never]: Properties[K];
      };
    };
  }[keyof Properties]
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
