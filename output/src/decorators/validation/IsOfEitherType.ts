import { formatList, registerDecorator, ValidationArguments, ValidationOptions } from '../..';

export type PossibleType =
  | 'array'
  | 'undefined'
  | 'object'
  | 'boolean'
  | 'number'
  | 'string'
  | 'symbol'
  | 'function';

export function IsOfEitherType(
  types: PossibleType[],
  options?: ValidationOptions,
): PropertyDecorator {
  return function (object, propertyKey) {
    registerDecorator({
      name: 'isOfEitherType',
      target: object.constructor,
      propertyName: propertyKey.toString(),
      constraints: [types],
      options,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) {
            return false;
          }
          if (!args.constraints[0].includes(typeof value)) {
            args.constraints[1] = typeof value;
            return false;
          }
          if (Array.isArray(value)) {
            if (args.constraints[0].includes('array')) {
              return true;
            } else {
              args.constraints[1] = 'Array';
              return false;
            }
          }
          return false;
        },
        defaultMessage(args: ValidationArguments) {
          const typesText = formatList(args.constraints[0]);
          const eachText = options?.each ? 'each item in ' : '';
          return `${eachText}$property has to be one of the following types ${typesText}. Current type is ${args.constraints[1]}`;
        },
      },
    });
  };
}
