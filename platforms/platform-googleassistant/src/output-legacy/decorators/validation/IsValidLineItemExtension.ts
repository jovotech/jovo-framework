import { UnknownObject } from '@jovotech/framework';
import {
  formatValidationErrors,
  IsEitherValid,
  validate,
  ValidationArguments,
  ValidationOptions,
} from '@jovotech/output';
import { LineItem, PurchaseItemExtension, ReservationItemExtension } from '../../models';

export function IsValidLineItemExtension(validationOptions?: ValidationOptions): PropertyDecorator {
  return IsEitherValid<LineItem>(
    {
      name: 'isValidLineItemExtension',
      keys: ['purchase', 'reservation'],
      validate: async (value: UnknownObject, args: ValidationArguments) => {
        const classType =
          args.property === 'purchase' ? PurchaseItemExtension : ReservationItemExtension;

        if (!(value instanceof classType)) {
          return `$property has to be an instance of ${classType.name}`;
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
