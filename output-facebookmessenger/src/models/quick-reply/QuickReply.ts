import { IsEnum, QuickReplyValue } from '@jovotech/output';

export enum QuickReplyContentType {
  Text = 'text',
  Email = 'user_email',
  PhoneNumber = 'user_phone_number',
}

export class QuickReply<T extends QuickReplyContentType = QuickReplyContentType> {
  @IsEnum(QuickReplyContentType)
  content_type: T;

  title?: T extends QuickReplyContentType.Email | QuickReplyContentType.PhoneNumber
    ? never
    : T extends QuickReplyContentType.Text
    ? string
    : string | undefined;

  payload?: T extends QuickReplyContentType.Email | QuickReplyContentType.PhoneNumber
    ? never
    : T extends QuickReplyContentType.Text
    ? string | number
    : string | number | undefined;

  image_url?: T extends QuickReplyContentType.Email | QuickReplyContentType.PhoneNumber
    ? never
    : string | undefined;

  toQuickReply?(): QuickReplyValue | undefined {
    if (this.content_type !== QuickReplyContentType.Text || !this.title) {
      return undefined;
    }
    return this.payload
      ? {
          text: this.title,
          value: this.payload.toString(),
        }
      : this.title;
  }
}
