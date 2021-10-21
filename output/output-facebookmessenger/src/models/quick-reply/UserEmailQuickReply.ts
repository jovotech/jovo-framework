import { Equals, QuickReplyValue } from '@jovotech/output';
import { QuickReplyBase, QuickReplyContentType } from './QuickReply';

export class UserEmailQuickReply extends QuickReplyBase<
  QuickReplyContentType.UserEmail | 'user_email'
> {
  @Equals(QuickReplyContentType.UserEmail)
  content_type: QuickReplyContentType.UserEmail | 'user_email';

  toQuickReply?(): QuickReplyValue | undefined {
    return;
  }
}
