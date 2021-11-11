import { AnyObject } from '@jovotech/framework';
import { registerDecorator, ValidationArguments, ValidationOptions } from '@jovotech/output';
import { TextContent } from '../../models';

export function MainTextMaxLength(length: number, options?: ValidationOptions): PropertyDecorator {
  return function (object, propertyKey) {
    registerDecorator({
      name: 'mainTextMaxLength',
      target: object.constructor,
      propertyName: propertyKey.toString(),
      constraints: [length],
      options,
      validator: {
        validate(value: AnyObject, args: ValidationArguments) {
          if (!(value instanceof TextContent)) {
            return true;
          }

          if (value.primaryText?.text?.length > args.constraints[0]) {
            args.constraints[1] = `primaryText of $property can not exceed ${args.constraints[0]} characters`;
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
