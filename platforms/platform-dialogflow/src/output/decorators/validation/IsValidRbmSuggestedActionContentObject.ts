import { UnknownObject } from '@jovotech/framework';
import {
  formatValidationErrors,
  IsEitherValid,
  isObject,
  validate,
  ValidationOptions,
} from '@jovotech/output';
import { RbmSuggestedActionContent } from '../../models/message/rbm/RbmSuggestion';

export function IsValidRbmSuggestedActionContentObject(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return IsEitherValid<RbmSuggestedActionContent>(
    {
      name: 'isValidRbmSuggestedActionContentObject',
      keys: ['dial', 'open_url', 'share_location'],
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
