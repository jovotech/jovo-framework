import {
  Equals,
  IsOfEitherType,
  IsString,
  IsUrl,
  MaxLength,
  QuickReplyValue,
  ValidateIf,
} from '@jovotech/output';
import { PAYLOAD_MAX_LENGTH, QUICK_REPLY_TITLE_MAX_LENGTH } from '../../constants';
import { CastedMaxLength } from '../../decorators/validation/CastedMaxLength';
import { QuickReplyBase, QuickReplyContentType } from './QuickReply';

export class TextQuickReply extends QuickReplyBase<QuickReplyContentType.Text | 'text'> {
  @Equals(QuickReplyContentType.Text)
  content_type!: QuickReplyContentType.Text | 'text';

  @IsString()
  @MaxLength(QUICK_REPLY_TITLE_MAX_LENGTH)
  title!: string;

  @IsOfEitherType(['string', 'number'])
  @CastedMaxLength(PAYLOAD_MAX_LENGTH)
  payload!: string | number;

  @ValidateIf((o) => !o.title || o.image_url)
  @IsUrl()
  image_url?: string;

  toQuickReply?(): QuickReplyValue | undefined {
    return this.payload
      ? {
          text: this.title,
          value: this.payload.toString(),
        }
      : this.title;
  }
}
