import { UnknownObject } from '@jovotech/framework';
import {
  formatValidationErrors,
  IsEitherValid,
  isObject,
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
      validate: async (value) => {
        if (!isObject(value)) {
          return '$property must be an object.';
        }
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
