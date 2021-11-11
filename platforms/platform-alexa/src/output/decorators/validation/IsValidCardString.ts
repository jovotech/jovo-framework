import { AnyObject } from '@jovotech/framework';
import {
  isDefined,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from '@jovotech/output';
import { Card, CardTypeLike } from '../../models';
import { validateAlexaString } from '../../utilities';

export function IsValidCardString(
  relatedTypes: CardTypeLike[],
  options?: ValidationOptions,
): PropertyDecorator {
  return function (object, propertyKey) {
    registerDecorator({
      name: 'isValidCardString',
      target: object.constructor,
      propertyName: propertyKey.toString(),
      constraints: [],
      options,
      validator: {
        validate(value: AnyObject, args: ValidationArguments) {
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
            const result = validateAlexaString(value);
            if (result) {
              args.constraints[0] = result;
              return false;
            }
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
