import { AnyObject, UnknownObject } from '@jovotech/common';
import { registerDecorator, ValidationArguments, ValidationOptions } from '../..';

export function ConditionalMaxLength<T = UnknownObject>(
  conditionFn: (obj: T) => number,
  options?: ValidationOptions,
): PropertyDecorator {
  return function (object: AnyObject, propertyKey: string | symbol) {
    registerDecorator({
      name: 'conditionalMaxLength',
      target: object.constructor,
      propertyName: propertyKey.toString(),
      constraints: [conditionFn],
      options,
      validator: {
        validate(value: string, args: ValidationArguments) {
          if (!value) {
            return false;
          }
          const maxLength = args.constraints[0](args.object);
          return value.length <= maxLength;
        },
      },
    });
  };
}
