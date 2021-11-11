import { AnyObject, UnknownObject } from '@jovotech/common';
import {
  registerDecorator,
  validate,
  ValidationArguments,
  ValidationError,
  ValidationOptions,
} from '../..';

export function IsStringOrInstance(
  classType: new () => UnknownObject,
  options?: ValidationOptions,
): PropertyDecorator {
  return function (object: AnyObject, propertyKey: string | symbol) {
    registerDecorator({
      name: 'isStringOrInstance',
      target: object.constructor,
      propertyName: propertyKey.toString(),
      constraints: [classType],
      options,
      async: true,
      validator: {
        async validate(value: string | UnknownObject, args: ValidationArguments) {
          if (typeof value === 'string' && value.length) {
            return true;
          } else if (typeof value === 'object' && value instanceof args.constraints[0]) {
            const errors = await validate(value);
            args.constraints[1] = errors;
            return !errors.length;
          }
          const error = new ValidationError();
          error.target = object;
          error.property = propertyKey.toString();
          error.value = value;
          error.constraints = {
            isValidMessage: `$property should either be a non-empty string or a valid ${args.constraints[0].name}-instance`,
          };
          error.children = [];
          args.constraints[1] = [error];
          return false;
        },
        defaultMessage(args: ValidationArguments) {
          const eachText = options?.each ? 'each item in ' : '';
          const errors: ValidationError[] = args.constraints[1];
          const errorText = errors
            .map((error) => {
              return Object.values(error.constraints || {});
            })
            .join(', ');
          return `$property is invalid: ${eachText}${errorText}`;
        },
      },
    });
  };
}
