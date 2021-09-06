import { Equals, QuickReplyValue } from '@jovotech/output';
import { QuickReplyBase, QuickReplyContentType } from './QuickReply';

export class EmailQuickReply extends QuickReplyBase<QuickReplyContentType.Email | 'user_email'> {
  @Equals(QuickReplyContentType.Email)
  content_type: QuickReplyContentType.Email | 'user_email';

  toQuickReply?(): QuickReplyValue | undefined {
    return;
  }
}
