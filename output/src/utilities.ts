import { Type } from 'class-transformer';
import _merge from 'lodash.merge';
import type { A, O } from 'ts-toolbelt';
import { IsOptional, ValidateNested, ValidationError } from '.';
import { OutputTemplatePlatforms } from './models/OutputTemplatePlatforms';

export function registerOutputPlatform<TYPE extends Record<string, unknown>>(
  platformKey: string,
  platformType: new () => TYPE,
): void {
  IsOptional()(OutputTemplatePlatforms.prototype, platformKey);
  ValidateNested()(OutputTemplatePlatforms.prototype, platformKey);
  Type(() => platformType)(OutputTemplatePlatforms.prototype, platformKey);
}

export function toSSML(text: string): string {
  text = text.replace(/<[/]?speak>/g, '');
  return `<speak>${text}</speak>`;
}

export function removeSSMLSpeakTags(ssml: string): string {
  return ssml.replace(/<[/]?speak>/g, '');
}

export function removeSSML(ssml: string): string {
  return ssml.replace(/<[^>]*>/g, '');
}

export interface FormatValidationErrorsOptions {
  text?: string;
  delimiter?: string;
  path?: string;
}

export function formatValidationErrors(
  errors: ValidationError[],
  options?: FormatValidationErrorsOptions,
): string {
  const errorMessages: string[] = [];

  // go through each validation error, add message for constraints, if children add children with updated path
  function handleValidationError(error: ValidationError, path = '') {
    path += error.property;
    if (error.constraints) {
      const values = Object.values(error.constraints);
      errorMessages.push(
        ...values.map((text) => {
          return `${path.endsWith('.') ? path.slice(0, path.length - 1) : path}: ${text}`;
        }),
      );
    }
    if (error.children?.length) {
      for (let i = 0, len = error.children.length; i < len; i++) {
        handleValidationError(error.children[i], path + '.');
      }
    }
  }

  for (let i = 0, len = errors.length; i < len; i++) {
    handleValidationError(errors[i], options?.path ? `${options.path}.` : undefined);
  }

  const { text, delimiter } = { text: '', delimiter: '\n - ', ...(options || {}) };

  return `${text}${delimiter}${errorMessages.join(delimiter)}`;
}

export function formatList(
  items: Array<string | number | symbol>,
  delimiter = ', ',
  lastDelimiter = ' or ',
): string {
  if (items.length === 0) {
    return '';
  }
  if (items.length === 1) {
    return items[0].toString();
  }
  return `${items
    .slice(0, items.length - 1)
    .map((item) => item.toString())
    .join(delimiter)}${lastDelimiter}${items[items.length - 1].toString()}`;
}

export type FilterKey<K, I> = A.Equals<K, I> extends 1 ? never : K;
export type OmitIndex<T, I extends string | number> = {
  [K in keyof T as FilterKey<K, I>]: T[K];
};

export type OmitWhere<OBJECT, TYPE> = Omit<
  OBJECT,
  {
    [KEY in keyof OBJECT]: OBJECT[KEY] extends TYPE ? KEY : never;
  }[keyof OBJECT]
>;

export type PlainObjectType<OBJECT> = OmitWhere<OBJECT, () => unknown>;

export function isAnInstance(
  instance: unknown,
  ignoredConstructorNames = ['Object', 'Array'],
): boolean {
  return (
    typeof instance === 'object' &&
    !!instance?.constructor?.name &&
    !ignoredConstructorNames.includes(instance.constructor.name)
  );
}

export function instanceToObject<T>(instance: T): T {
  if (!isAnInstance(instance)) {
    return instance;
  }
  return Object.keys(instance).reduce((object: T, key) => {
    const value = (instance as Record<keyof T, T[keyof T]>)[key as keyof T];
    object[key as keyof T] = isAnInstance(value) ? instanceToObject(value) : value;
    return object;
  }, {} as T);
}

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
export function mergeInstances<D extends object, S extends any[]>(
  destination: D,
  ...sources: S
): O.MergeAll<OmitIndex<D, string>, S, 'deep'> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return _merge(
    instanceToObject(destination),
    ...sources.map((source) => instanceToObject(source)),
  );
}
