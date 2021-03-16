import { Equals, IsOfEitherType, IsString, IsUrl, MaxLength, ValidateIf } from '@jovotech/output';
import { CastedMaxLength } from '../../decorators/validation/CastedMaxLength';
import { QuickReply, QuickReplyContentType } from './QuickReply';

export class TextQuickReply extends QuickReply<QuickReplyContentType.Text> {
  @Equals(QuickReplyContentType.Text)
  content_type: QuickReplyContentType.Text;

  @IsString()
  @MaxLength(20)
  title: string;

  @IsOfEitherType(['string', 'number'])
  @CastedMaxLength(1000)
  payload: string | number;

  @ValidateIf((o) => !o.title || o.image_url)
  @IsUrl()
  image_url?: string;
}
