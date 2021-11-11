import { AnyObject } from '@jovotech/common';
import {
  formatList,
  isDefined,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from '../..';

export interface IsEitherValidOptions<T = unknown> {
  name?: string;
  keys: Array<keyof T>;
  validate?: (
    value: unknown,
    args: ValidationArguments,
  ) => string | undefined | void | Promise<string | undefined | void>;
}

export function IsEitherValid<T = unknown>(
  options: IsEitherValidOptions<T>,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  if (options.keys.length <= 1) {
    throw new Error('At least 2 keys have to be defined in order to use IsEitherValid.');
  }
  return function (object: AnyObject, propertyKey: string | symbol) {
    registerDecorator({
      name: options.name || 'isEitherValid',
      target: object.constructor,
      propertyName: propertyKey.toString(),
      constraints: [options],
      options: validationOptions,
      async: true,
      validator: {
        async validate(value: unknown, args: ValidationArguments) {
          const { keys, validate } = args.constraints[0] as IsEitherValidOptions<T>;

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

          // check if either multiple or none are defined
          if (
            (isDefined(value) && otherDefinedPropertyPairs.length) ||
            (!isDefined(value) && !otherDefinedPropertyPairs.length)
          ) {
            const keysText = formatList(keys);

            const otherDefinedPropertyKeys = otherDefinedPropertyPairs.map((entry) => {
              return entry[0];
            });

            const tipText =
              otherDefinedPropertyKeys.length === 0
                ? 'None is defined.'
                : otherDefinedPropertyKeys.length === 1
                ? `The property ${otherDefinedPropertyKeys[0]} is also defined.`
                : `The properties ${formatList(
                    otherDefinedPropertyKeys,
                    ', ',
                    ' and ',
                  )} are also defined.`;

            args.constraints[1] = `Either ${keysText} must be defined. ${tipText}`;
            return false;
          }
          // assume value is not defined because we check the case before that in the previous condition
          // return true to skip validation for these properties and not throw an error.
          if (otherDefinedPropertyPairs.length) {
            return true;
          }

          if (validate) {
            const validationResult = await validate(value, args);

            if (validationResult) {
              args.constraints[1] = validationResult;
              return false;
            }
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
