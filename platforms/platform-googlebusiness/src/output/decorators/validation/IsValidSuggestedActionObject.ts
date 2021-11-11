import {
  formatValidationErrors,
  IsEitherValid,
  isObject,
  validate,
  ValidationOptions,
} from '@jovotech/output';
import { SuggestedAction } from '../../models/suggestion/SuggestedAction';

export function IsValidSuggestedActionObject(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return IsEitherValid<SuggestedAction>(
    {
      name: 'isValidSuggestedActionObject',
      keys: ['openUrlAction', 'dialAction'],
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
