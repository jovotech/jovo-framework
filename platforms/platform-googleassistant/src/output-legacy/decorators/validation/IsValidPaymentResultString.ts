import { IsEitherValid, isString, ValidationOptions } from '@jovotech/output';
import { PaymentResult } from '../../models';

export function IsValidPaymentResultString(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return IsEitherValid<PaymentResult>(
    {
      name: 'isValidPaymentResultString',
      keys: ['googlePaymentData', 'merchantPaymentMethodId'],
      validate: (value: string) => {
        if (!isString(value)) {
          return '$property must be a string';
        }
        if (!value) {
          return '$property should not be empty';
        }
        return;
      },
    },
    validationOptions,
  );
}
