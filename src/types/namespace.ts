import { UnionToIntersection } from "type-fest";

export type NestedNamespace<Properties> = UnionToIntersection<
  {
    [K in keyof Properties]: {
      [Key in K extends `${infer Namespace}_${string}` ? Namespace : never]: {
        [Key in K extends `${string}_${infer MethodName}`
          ? MethodName
          : never]: Properties[K];
      };
    };
  }[keyof Properties]
>;

export type FlatNamespace<Prefix extends string, Properties> = {
  [K in keyof Properties as K extends `${Prefix}_${infer MethodName}`
    ? MethodName
    : K]: Properties[K];
};
