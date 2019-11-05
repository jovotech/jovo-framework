import { QuickReplyContentType } from '../../Enums';
import { QuickReply } from '../../Interfaces';

export type BuiltInQuickReplyTypes = Exclude<QuickReplyContentType, QuickReplyContentType.Text>;

export class BuiltInQuickReply implements QuickReply {
  constructor(
    public content_type: BuiltInQuickReplyTypes,
    public title?: string,
    public imageUrl?: string,
  ) {}
}
