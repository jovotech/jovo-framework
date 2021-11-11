import { registerDecorator, ValidationArguments, ValidationOptions } from '@jovotech/output';
import { OutputSpeech, OutputSpeechType } from '../../models';
import { validateAlexaString } from '../../utilities';

export function IsValidOutputSpeechString(
  relatedType: OutputSpeechType,
  options?: ValidationOptions,
): PropertyDecorator {
  return function (object, propertyKey) {
    registerDecorator({
      name: 'isValidOutputSpeechString',
      target: object.constructor,
      propertyName: propertyKey.toString(),
      constraints: [],
      options,
      validator: {
        validate(value: string, args: ValidationArguments) {
          const type = (args.object as OutputSpeech).type;
          // if there is no type, skip for now because another decorator should take care of that
          if (!type) {
            return true;
          }
          if (type === relatedType) {
            const result = validateAlexaString(value);
            if (result) {
              args.constraints[0] = result;
              return false;
            }
          } else if (value) {
            args.constraints[0] = `$property can not be set when the type is ${type}`;
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
