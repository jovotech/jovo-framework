import { Equals, IsOfEitherType, IsString, IsUrl, MaxLength, ValidateIf } from '@jovotech/output';
import { PAYLOAD_MAX_LENGTH, QUICK_REPLY_TITLE_MAX_LENGTH } from '../../constants';
import { CastedMaxLength } from '../../decorators/validation/CastedMaxLength';
import { QuickReply, QuickReplyContentType } from './QuickReply';

export class TextQuickReply extends QuickReply<QuickReplyContentType.Text> {
  @Equals(QuickReplyContentType.Text)
  content_type: QuickReplyContentType.Text;

  @IsString()
  @MaxLength(QUICK_REPLY_TITLE_MAX_LENGTH)
  title: string;

  @IsOfEitherType(['string', 'number'])
  @CastedMaxLength(PAYLOAD_MAX_LENGTH)
  payload: string | number;

  @ValidateIf((o) => !o.title || o.image_url)
  @IsUrl()
  image_url?: string;
}
