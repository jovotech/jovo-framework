import { EnumLike, IsEnum, QuickReplyValue } from '@jovotech/output';
import { EmailQuickReply } from './EmailQuickReply';
import { PhoneNumberQuickReply } from './PhoneNumberQuickReply';
import { TextQuickReply } from './TextQuickReply';

export enum QuickReplyContentType {
  Text = 'text',
  Email = 'user_email',
  PhoneNumber = 'user_phone_number',
}

export type QuickReplyContentTypeLike = EnumLike<QuickReplyContentType>;

export abstract class QuickReplyBase<T extends QuickReplyContentTypeLike = QuickReplyContentTypeLike> {
  [key: string]: unknown;

  @IsEnum(QuickReplyContentType)
  content_type: T;

  abstract toQuickReply?(): QuickReplyValue | undefined;
}

export type QuickReply = EmailQuickReply | PhoneNumberQuickReply | TextQuickReply
