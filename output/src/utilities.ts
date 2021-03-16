import { Type } from 'class-transformer';
import { IsOptional, ValidateNested, ValidationError } from '.';
import { GenericOutputPlatforms } from './models/GenericOutputPlatforms';

export function registerOutputPlatform<TYPE extends Record<string, unknown>>(
  platformKey: string,
  platformType: new () => TYPE,
): void {
  IsOptional()(GenericOutputPlatforms.prototype, platformKey);
  ValidateNested()(GenericOutputPlatforms.prototype, platformKey);
  Type(() => platformType)(GenericOutputPlatforms.prototype, platformKey);
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
