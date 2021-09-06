import { Type } from '@jovotech/output';
import {
  EmailQuickReply,
  PhoneNumberQuickReply,
  QuickReplyBase,
  QuickReplyContentType,
  TextQuickReply,
} from '../../models';

export function TransformQuickReply(): PropertyDecorator {
  return Type(() => QuickReplyBase, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'content_type',
      subTypes: [
        { value: EmailQuickReply, name: QuickReplyContentType.Email },
        { value: PhoneNumberQuickReply, name: QuickReplyContentType.PhoneNumber },
        { value: TextQuickReply, name: QuickReplyContentType.Text },
      ],
    },
  }) as PropertyDecorator;
}
