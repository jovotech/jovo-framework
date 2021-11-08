import {
  formatValidationErrors,
  IsEitherValid,
  validate,
  ValidationOptions,
} from '@jovotech/output';
import { RichCard } from '../../models/RichCard';

export function IsValidRichCardObject(validationOptions?: ValidationOptions): PropertyDecorator {
  return IsEitherValid<RichCard>(
    {
      name: 'isValidRichCardObject',
      keys: ['standaloneCard', 'carouselCard'],
      validate: async (value: Record<string, unknown>) => {
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
