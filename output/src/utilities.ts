import { Constructor } from '@jovotech/common';
import { Type } from 'class-transformer';
import _mergeWith from 'lodash.mergewith';
import _unset from 'lodash.unset';
import type { O } from 'ts-toolbelt';
import { RichAudio, Sequencer, IsOptional, ListenValue, ValidateNested, ValidationError } from '.';
import { NormalizedOutputTemplatePlatforms } from './models/NormalizedOutputTemplatePlatforms';

export function registerOutputPlatform<TYPE extends Record<string, unknown>>(
  platformKey: string,
  platformType: Constructor<TYPE>,
): void {
  IsOptional()(NormalizedOutputTemplatePlatforms.prototype, platformKey);
  ValidateNested()(NormalizedOutputTemplatePlatforms.prototype, platformKey);
  Type(() => platformType)(NormalizedOutputTemplatePlatforms.prototype, platformKey);
}

export function isSSML(text: string): boolean {
  return /^<speak>.*<\/speak>$/.test(text);
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
): O.MergeAll<D, S, 'deep'> {
  return _mergeWith(
    destination,
    ...sources.map((source) => instanceToObject(source)),
    // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
    (value: any, srcValue: any, key: string, object: any) => {
      if (typeof srcValue === 'undefined') {
        _unset(object, key);
      }
    },
  );
}

export function mergeListen(
  target: ListenValue | null | undefined,
  mergeWith: ListenValue | null | undefined,
): ListenValue | null | undefined {
  // if target is an object and not null and mergeWith is true, target should not be overwritten
  if (typeof target === 'object' && target && mergeWith === true) {
    return target;
  }
  // if mergeWith is not undefined, target should become mergeWith
  if (typeof mergeWith !== 'undefined') {
    // if mergeWith is an object and not null, just return a copy of mergeWith, otherwise return mergeWith
    return typeof mergeWith === 'object' && mergeWith ? { ...mergeWith } : mergeWith;
  }
  // if mergeWith is undefined, just return target
  return target;
}

export function mergeRichAudio(
  target: RichAudio | null | undefined,
  mergeWith: RichAudio,
): RichAudio {
  if (!target) {
    return mergeWith;
  }

  // If there are two richAudio responses, we want to sequence them one after the other
  return {
    type: 'Sequencer',
    items: [target, mergeWith],
  } as Sequencer;
}
