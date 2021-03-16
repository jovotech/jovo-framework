import {
  formatValidationErrors,
  IsArray,
  IsEitherValid,
  IsOptional,
  IsString,
  MaxLength,
  Type,
  validate,
  ValidateNested,
} from '@jovotech/output';
import { EmailQuickReply } from '../quick-reply/EmailQuickReply';
import { PhoneNumberQuickReply } from '../quick-reply/PhoneNumberQuickReply';
import { QuickReply, QuickReplyContentType } from '../quick-reply/QuickReply';
import { TextQuickReply } from '../quick-reply/TextQuickReply';
import { MessageAttachment } from './MessageAttachment';

export class Message {
  @IsEitherValid<Message>({
    keys: ['text', 'attachment'],
    validate: (value, args) => {
      if (typeof value !== 'string') {
        return '$property must be a string';
      }
      if (!value) {
        return '$property should not be empty';
      }
      if (value.length > 2000) {
        return '$property can not exceed 2000 characters';
      }
      return;
    },
  })
  text?: string;

  @IsEitherValid<Message>({
    keys: ['text', 'attachment'],
    validate: async (value, args) => {
      if (!(value instanceof MessageAttachment)) {
        return '$property must be an instance of MessageAttachment';
      }
      const errors = await validate(value);
      if (errors.length) {
        return formatValidationErrors(errors, {
          text: '$property is invalid:',
          delimiter: '\n  - ',
          path: '$property',
        });
      }
    },
  })
  @Type(() => MessageAttachment)
  attachment?: MessageAttachment;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuickReply, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'type',
      subTypes: [
        { value: TextQuickReply, name: QuickReplyContentType.Text },
        { value: EmailQuickReply, name: QuickReplyContentType.Email },
        { value: PhoneNumberQuickReply, name: QuickReplyContentType.PhoneNumber },
      ],
    },
  })
  quick_replies?: QuickReply[];

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  metadata?: string;
}
