import type { A, L, S } from 'ts-toolbelt';
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

// Convert keys K of T to optional elements
export type PartialWhere<T, K extends keyof T> = Omit<T, K> & Partial<T>;

// Returns all elements of T that are non-optional. Works with nested objects.
// If an entry T[K] is assignable to a weak type, it will be omitted from the object.
export type RequiredOnly<
  T,
  O extends OmitIndex<T, string | number> = OmitIndex<T, string | number>,
> = {
  [K in keyof O as Partial<UnknownObject> extends Pick<O, K>
    ? never
    : K]: Partial<UnknownObject> extends Pick<O, K>
    ? never
    : Pick<O, K> extends UnknownObject
    ? RequiredOnly<O[K]>
    : Pick<O, K>;
};

export type FirstKey<K extends string> = Shift<S.Split<K, '.'>>;

export type Shift<S extends L.List> = S extends readonly [infer P, ...unknown[]] ? P : never;

export type KeyOf<T, K> = K extends keyof T ? K : never;

export type RequiredOnlyWhere<T, K extends string> = L.Length<S.Split<K, '.'>> extends 1
  ? PartialDeep<T> & { [KEY in keyof T as KEY extends K ? KEY : never]: T[KEY] }
  : PartialDeep<T> & {
      [KEY in keyof T as KEY extends FirstKey<K> ? KEY : never]: RequiredOnlyWhere<
        T[KEY],
        S.Join<L.Omit<S.Split<K, '.'>, 0>>
      >;
    };

// If T is a string enum return a union type of the enum and the enum as string literal
export type EnumLike<T extends string> = T | `${T}`;

// Removes all methods and the index signature of the given object
export type PlainObjectType<T extends UnknownObject> = OmitWhere<
  OmitIndex<T, string | number>,
  (...args: unknown[]) => unknown
>;

export { ILogObject, ISettingsParam } from 'tslog';
export * from './Configurable';
export * from './Input';
export * from './JovoError';
export * from './JovoLogger';
