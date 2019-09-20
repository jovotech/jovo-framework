import { Button } from './Button';
import { BasicCard } from './BasicCard';

export class QuickReplyContent {
  title?: string;
  buttons?: Button[];
}

export class QuickReply extends BasicCard {
  content?: QuickReplyContent;

  constructor(content: QuickReplyContent) {
    super('quickReplies');
    this.content = content;
  }
}
