import {
  formatValidationErrors,
  IsEitherValid,
  validate,
  ValidationOptions,
} from '@jovotech/output';
import { RbmSuggestionContent } from '../../models/message/rbm/RbmSuggestion';

export function IsValidRbmSuggestionContentObject(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return IsEitherValid<RbmSuggestionContent>(
    {
      name: 'isValidRbmSuggestionContentObject',
      keys: ['action', 'reply'],
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
