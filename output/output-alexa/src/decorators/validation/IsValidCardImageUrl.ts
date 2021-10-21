import { IsEitherValid, isURL, ValidationOptions } from '@jovotech/output';
import { CARD_IMAGE_URL_MAX_LENGTH } from '../../constants';
import { CardImage } from '../../models';

export function IsValidCardImageUrl(options?: ValidationOptions): PropertyDecorator {
  return IsEitherValid<CardImage>(
    {
      name: 'isValidCardImageUrl',
      keys: ['smallImageUrl', 'largeImageUrl'],
      validate: async (value, args) => {
        if (!isURL(value, { protocols: ['https'] })) {
          return '$property must be an URL address';
        }

        if (value.length > CARD_IMAGE_URL_MAX_LENGTH) {
          return `$property can not exceed ${CARD_IMAGE_URL_MAX_LENGTH} characters.`;
        }

        return;
      },
    },
    options,
  );
}
