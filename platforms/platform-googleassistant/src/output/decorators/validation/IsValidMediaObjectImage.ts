import {
  formatValidationErrors,
  IsEitherValid,
  validate,
  ValidationOptions,
} from '@jovotech/output';
import { Image, MediaImage } from '../../models';

export function IsValidMediaObjectImage(validationOptions?: ValidationOptions): PropertyDecorator {
  return IsEitherValid<MediaImage>(
    {
      name: 'isValidMediaObjectImage',
      keys: ['large', 'icon'],
      validate: async (value) => {
        if (!(value instanceof Image)) {
          return `$property has to be an instance of Image`;
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
