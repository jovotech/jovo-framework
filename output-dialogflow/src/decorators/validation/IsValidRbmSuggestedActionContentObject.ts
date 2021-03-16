import {
  formatValidationErrors,
  IsEitherValid,
  validate,
  ValidationOptions,
} from '@jovotech/output';
import {
  RbmSuggestedActionContent,
  RbmSuggestionContent,
} from '../../models/message/rbm/RbmSuggestion';

export function IsValidRbmSuggestedActionContentObject(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return IsEitherValid<RbmSuggestedActionContent>(
    {
      name: 'isValidRbmSuggestedActionContentObject',
      keys: ['dial', 'open_url', 'share_location'],
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
