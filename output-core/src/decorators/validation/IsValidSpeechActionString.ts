import { IsEitherValid, isString, ValidationOptions } from '@jovotech/output';
import { SpeechAction } from '../../models';

export function IsValidSpeechActionString(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return IsEitherValid<SpeechAction>(
    {
      name: 'isValidSpeechActionString',
      keys: ['ssml', 'plain'],
      validate: (value, args) => {
        if (!isString(value)) {
          return '$property must be a string';
        }
        if (!value) {
          return '$property should not be empty';
        }
        return;
      },
    },
    validationOptions,
  );
}
