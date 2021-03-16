import {
  formatValidationErrors,
  IsEitherValid,
  validate,
  ValidationOptions,
} from '@jovotech/output';
import { Order, PurchaseOrderExtension, TicketOrderExtension } from '../../models';

export function IsValidOrderExtension(validationOptions?: ValidationOptions): PropertyDecorator {
  return IsEitherValid<Order>(
    {
      name: 'isValidOrderExtension',
      keys: ['purchase', 'ticket'],
      validate: async (value, args) => {
        const classType =
          args.property === 'purchase' ? PurchaseOrderExtension : TicketOrderExtension;

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
