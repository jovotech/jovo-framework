import { Type } from '@jovotech/output';
import { TextQuickReply, UserEmailQuickReply, UserPhoneNumberQuickReply } from '../../models';
// import should not be shortened or decorator has problems with finding the correct enum
import { QuickReplyBase, QuickReplyContentType } from '../../models/quick-reply/QuickReply';

export function TransformQuickReply(): PropertyDecorator {
  return Type(() => QuickReplyBase, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'content_type',
      subTypes: [
        { value: UserEmailQuickReply, name: QuickReplyContentType.UserEmail },
        { value: UserPhoneNumberQuickReply, name: QuickReplyContentType.UserPhoneNumber },
        { value: TextQuickReply, name: QuickReplyContentType.Text },
      ],
    },
  }) as PropertyDecorator;
}
