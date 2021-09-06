import { Equals, QuickReplyValue } from '@jovotech/output';
import { QuickReplyBase, QuickReplyContentType } from './QuickReply';

export class PhoneNumberQuickReply extends QuickReplyBase<
  QuickReplyContentType.PhoneNumber | 'user_phone_number'
> {
  @Equals(QuickReplyContentType.PhoneNumber)
  content_type: QuickReplyContentType.PhoneNumber | 'user_phone_number';

  toQuickReply?(): QuickReplyValue | undefined {
    return;
  }
}
