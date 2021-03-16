import { Equals } from '@jovotech/output';
import { QuickReply, QuickReplyContentType } from './QuickReply';

export class EmailQuickReply extends QuickReply<QuickReplyContentType.Email> {
  @Equals(QuickReplyContentType.Email)
  content_type: QuickReplyContentType.Email;
}
