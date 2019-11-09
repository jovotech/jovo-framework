import { QuickReply, QuickReplyContentType } from '../..';

export class TextQuickReply implements QuickReply {
  content_type: QuickReplyContentType;

  constructor(public title: string, public payload: string | number, public imageUrl?: string) {
    this.content_type = QuickReplyContentType.Text;
  }
}
