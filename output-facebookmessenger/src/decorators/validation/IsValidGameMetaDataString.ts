import { IsEitherValid, isString, ValidationOptions } from '@jovotech/output';
import { GameMetaData } from '../../models/button/GamePlayButton';

export function IsValidGameMetaDataString(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return IsEitherValid<GameMetaData>(
    {
      name: 'isValidGameMetaDataString',
      keys: ['player_id', 'context_id'],
      validate: (value, args) => {
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
