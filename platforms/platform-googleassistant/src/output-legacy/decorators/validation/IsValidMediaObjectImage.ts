import { UnknownObject } from '@jovotech/framework';
import {
  formatValidationErrors,
  IsEitherValid,
  validate,
  ValidationOptions,
} from '@jovotech/output';
import { LegacyImage, LegacyMediaObject } from '../../models';

export function IsValidMediaObjectImage(validationOptions?: ValidationOptions): PropertyDecorator {
  return IsEitherValid<LegacyMediaObject>(
    {
      name: 'isValidMediaObjectImage',
      keys: ['largeImage', 'icon'],
      validate: async (value: UnknownObject) => {
        if (!(value instanceof LegacyImage)) {
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
