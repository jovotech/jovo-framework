import {
  formatValidationErrors,
  IsEitherValid,
  isObject,
  validate,
  ValidationOptions,
} from '@jovotech/output';
import { MessageContent } from '../../models/Message';

const KEYS: Array<keyof MessageContent> = [
  'text',
  'image',
  'quick_replies',
  'card',
  'payload',
  'simple_responses',
  'basic_card',
  'suggestions',
  'link_out_suggestion',
  'list_select',
  'carousel_select',
  'telephony_play_audio',
  'telephony_synthesize_speech',
  'telephony_transfer_call',
  'rbm_text',
  'rbm_standalone_rich_card',
  'rbm_carousel_rich_card',
  'browse_carousel_card',
  'table_card',
  'media_content',
];

const ACTIONS_ON_GOOGLE_KEYS: Array<keyof MessageContent> = [
  'simple_responses',
  'basic_card',
  'suggestions',
  'link_out_suggestion',
  'list_select',
  'carousel_select',
  'browse_carousel_card',
  'table_card',
  'media_content',
];

export function IsValidMessageContentObject(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return IsEitherValid<MessageContent>(
    {
      name: 'isValidMessageContentObject',
      keys: KEYS,
      validate: async (value, args) => {
        if (ACTIONS_ON_GOOGLE_KEYS.includes(args.property as keyof MessageContent)) {
          // do not validate actions on google-objects for now
          return;
        }
        if (!isObject(value)) {
          return '$property must be an object.';
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
