import { Type } from '@jovotech/output';
import { EmailQuickReply, PhoneNumberQuickReply, TextQuickReply } from '../../models';
// import should not be shortened or decorator has problems with finding the correct enum
import { QuickReplyBase, QuickReplyContentType } from '../../models/quick-reply/QuickReply';

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
