import {
  formatValidationErrors,
  IsEitherValid,
  validate,
  ValidationOptions,
} from '@jovotech/output';
import { Suggestion } from '../../models/Suggestion';

export function IsValidSuggestionObject(validationOptions?: ValidationOptions): PropertyDecorator {
  return IsEitherValid<Suggestion>(
    {
      name: 'isValidSuggestionObject',
      keys: ['reply', 'action', 'liveAgentRequest', 'authenticationRequest'],
      validate: async (value, args) => {
        const errors = await validate(value);
        if (errors.length) {
          return formatValidationErrors(errors, {
            text: '$property is invalid:',
            delimiter: '\n  - ',
            path: '$property',
          });
        }
        return;
      },
    },
    validationOptions,
  );
}
