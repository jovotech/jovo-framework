import type { A } from 'ts-toolbelt';
import { PartialDeep } from 'type-fest';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObject = Record<string, any>;
export type UnknownObject = Record<string, unknown>;

// Return the type of the items in the array.
export type ArrayElement<ARRAY_TYPE extends readonly unknown[]> = ARRAY_TYPE[number];
// Adapter to make it easier to replace the type in the future
export type DeepPartial<T> = PartialDeep<T>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T = AnyObject, ARGS extends unknown[] = any[]> = new (...args: ARGS) => T;
// Construct object from properties of T that extend U.
export type PickWhere<T, U> = Pick<
  T,
  {
    [K in keyof T]: T[K] extends U ? K : never;
  }[keyof T]
>;
// Construct object from properties of T that do not extend U.
export type OmitWhere<T, U> = Omit<
  T,
  {
    [K in keyof T]: T[K] extends U ? K : never;
  }[keyof T]
>;
// If K equals I return never, otherwise return the key.
export type FilterKey<K, I> = A.Equals<K, I> extends 1 ? never : K;
// Omit index signature of T if it equals index-signature I.
export type OmitIndex<T, I extends string | number> = {
  [K in keyof T as FilterKey<K, I>]: T[K];
};

export * from './JovoError';
export * from './JovoLogger';
export { ISettingsParam } from 'tslog';
