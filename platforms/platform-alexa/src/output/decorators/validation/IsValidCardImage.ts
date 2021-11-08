import { AnyObject } from '@jovotech/framework';
import {
  formatValidationErrors,
  isDefined,
  registerDecorator,
  validate,
  ValidationArguments,
  ValidationOptions,
} from '@jovotech/output';
import { Card, CardImage, CardTypeLike } from '../../models';

export function IsValidCardImage(
  relatedTypes: CardTypeLike[],
  options?: ValidationOptions,
): PropertyDecorator {
  return function (object, propertyKey) {
    registerDecorator({
      name: 'isValidCardImage',
      target: object.constructor,
      propertyName: propertyKey.toString(),
      constraints: [],
      options,
      async: true,
      validator: {
        async validate(value: AnyObject, args: ValidationArguments) {
          const type = (args.object as Card).type;
          // if there is no type, skip for now because another decorator should take care of that
          if (!type) {
            return true;
          }

          if (isDefined(value) && !relatedTypes.includes(type)) {
            args.constraints[0] = `$property can not be set when the type is ${type}`;
            return false;
          }

          if (isDefined(value)) {
            if (!(value instanceof CardImage)) {
              args.constraints[0] = '$property must be an instance of CardImage';
              return false;
            }

            const errors = await validate(value);
            args.constraints[0] = formatValidationErrors(errors, {
              text: '$property is invalid:',
              delimiter: '\n  - ',
              path: '$property',
            });
            return !errors.length;
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return args.constraints[0];
        },
      },
    });
  };
}
