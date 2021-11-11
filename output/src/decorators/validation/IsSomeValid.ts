import { AnyObject } from '@jovotech/common';
import {
  formatList,
  isDefined,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from '../..';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IsSomeValidOptions<T = any> {
  name?: string;
  keys: Array<keyof T>;
  validate: (
    value: unknown,
    args: ValidationArguments,
  ) => string | undefined | void | Promise<string | undefined | void>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function IsSomeValid<T = any>(
  options: IsSomeValidOptions<T>,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  if (options.keys.length <= 1) {
    throw new Error('At least 2 keys have to be defined in order to use IsSomeValid.');
  }
  return function (object: AnyObject, propertyKey: string | symbol) {
    registerDecorator({
      name: options.name || 'isSomeValid',
      target: object.constructor,
      propertyName: propertyKey.toString(),
      constraints: [options],
      options: validationOptions,
      async: true,
      validator: {
        async validate(value: unknown, args: ValidationArguments) {
          const { keys, validate } = args.constraints[0] as IsSomeValidOptions<T>;

          const otherKeys = keys.filter((key) => {
            return key !== args.property;
          });
          const otherPropertyMap: Partial<Record<keyof T, unknown>> = {};

          for (const key of otherKeys) {
            otherPropertyMap[key] = (args.object as unknown as T)[key];
          }

          const otherDefinedPropertyPairs = Object.entries(otherPropertyMap).filter((entry) => {
            return isDefined(entry[1]);
          });

          // check if none are defined
          if (!isDefined(value) && !otherDefinedPropertyPairs.length) {
            const keysText = formatList(keys);
            args.constraints[1] = `At least one of the properties ${keysText} must be defined. None is set.`;
            return false;
          }

          // return true to skip validation for this property and not throw an error.
          if (!isDefined(value)) {
            return true;
          }

          const validationResult = await validate(value, args);

          if (validationResult) {
            args.constraints[1] = validationResult;
            return false;
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return args.constraints[1];
        },
      },
    });
  };
}
