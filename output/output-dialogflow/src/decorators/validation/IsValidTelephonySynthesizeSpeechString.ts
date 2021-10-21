import { IsEitherValid, isString, ValidationOptions } from '@jovotech/output';
import { TelephonySynthesizeSpeech } from '../../models/message/telephony/TelephonySynthesizeSpeech';

export function IsValidTelephonySynthesizeSpeechString(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return IsEitherValid<TelephonySynthesizeSpeech>(
    {
      name: 'isValidTelephonySynthesizeSpeechString.ts',
      keys: ['text', 'ssml'],
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
