import { IsEitherValid, isURL, ValidationOptions } from '@jovotech/output';
import { CardImage } from '../../models/card/CardImage';

export function IsValidCardImageUrl(options?: ValidationOptions): PropertyDecorator {
  return IsEitherValid<CardImage>(
    {
      name: 'isValidCardImageUrl',
      keys: ['smallImageUrl', 'largeImageUrl'],
      validate: async (value, args) => {
        if (!isURL(value, { protocols: ['https'] })) {
          return '$property must be an URL address';
        }

        if (value.length > 2000) {
          return '$property can not exceed 2000 characters.';
        }

        return;
      },
    },
    options,
  );
}
