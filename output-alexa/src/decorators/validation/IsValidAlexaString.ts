import { registerDecorator, ValidationArguments, ValidationOptions } from '@jovotech/output';
import { validateAlexaString } from '../../utilities';

export function IsValidAlexaString(options?: ValidationOptions): PropertyDecorator {
  return function (object, propertyKey) {
    registerDecorator({
      name: 'isValidAlexaString',
      target: object.constructor,
      propertyName: propertyKey.toString(),
      constraints: [],
      options,
      async: true,
      validator: {
        async validate(value: any, args: ValidationArguments) {
          const error = validateAlexaString(value);
          if (error) {
            args.constraints[0] = error;
            return false;
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
