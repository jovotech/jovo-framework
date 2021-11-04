import { Equals, QuickReplyValue } from '@jovotech/output';
import { QuickReplyBase, QuickReplyContentType } from './QuickReply';

export class UserPhoneNumberQuickReply extends QuickReplyBase<
  QuickReplyContentType.UserPhoneNumber | 'user_phone_number'
> {
  @Equals(QuickReplyContentType.UserPhoneNumber)
  content_type!: QuickReplyContentType.UserPhoneNumber | 'user_phone_number';

  toQuickReply?(): QuickReplyValue | undefined {
    return;
  }
}
