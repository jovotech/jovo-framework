import { IsEnum, QuickReplyValue } from '@jovotech/output';
import { UserEmailQuickReply } from './UserEmailQuickReply';
import { UserPhoneNumberQuickReply } from './UserPhoneNumberQuickReply';
import { TextQuickReply } from './TextQuickReply';
import { EnumLike } from '@jovotech/framework';

export enum QuickReplyContentType {
  Text = 'text',
  UserEmail = 'user_email',
  UserPhoneNumber = 'user_phone_number',
}

export type QuickReplyContentTypeLike = EnumLike<QuickReplyContentType>;

export abstract class QuickReplyBase<
  T extends QuickReplyContentTypeLike = QuickReplyContentTypeLike,
> {
  [key: string]: unknown;

  @IsEnum(QuickReplyContentType)
  content_type!: T;

  abstract toQuickReply?(): QuickReplyValue | undefined;
}

export type QuickReply = UserEmailQuickReply | UserPhoneNumberQuickReply | TextQuickReply;
