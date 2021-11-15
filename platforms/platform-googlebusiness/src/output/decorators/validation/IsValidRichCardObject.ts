import {
  formatValidationErrors,
  IsEitherValid,
  isObject,
  validate,
  ValidationOptions,
} from '@jovotech/output';
import { RichCard } from '../../models/RichCard';

export function IsValidRichCardObject(validationOptions?: ValidationOptions): PropertyDecorator {
  return IsEitherValid<RichCard>(
    {
      name: 'isValidRichCardObject',
      keys: ['standaloneCard', 'carouselCard'],
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
