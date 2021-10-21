import {
  formatValidationErrors,
  IsEitherValid,
  validate,
  ValidationOptions,
} from '@jovotech/output';
import { RichResponseItem } from '../../models';

export function IsValidRichResponseItemObject(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return IsEitherValid<RichResponseItem>(
    {
      name: 'isValidRichResponseItemObject',
      keys: [
        'simpleResponse',
        'basicCard',
        'structuredResponse',
        'mediaResponse',
        'carouselBrowse',
        'tableCard',
        'htmlResponse',
      ],
      validate: async (value, args) => {
        const className = `${args.property.charAt(0).toUpperCase()}${args.property.slice(1)}`;
        if (value?.constructor?.name !== className) {
          return `$property has to be an instance of ${className}`;
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
