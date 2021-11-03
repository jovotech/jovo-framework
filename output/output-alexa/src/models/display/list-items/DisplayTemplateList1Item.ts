import { IsNotEmpty, IsOptional, IsString, Type, ValidateNested } from '@jovotech/output';
import { DISPLAY_TEMPLATE_ITEM_MAIN_TEXT_MAX_LENGTH } from '../../../constants';
import { MainTextMaxLength } from '../../../decorators/validation/MainTextMaxLength';
import { Image } from '../../common/Image';
import { TextContent } from '../TextContent';

export class DisplayTemplateList1Item {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Image)
  image?: Image;

  @MainTextMaxLength(DISPLAY_TEMPLATE_ITEM_MAIN_TEXT_MAX_LENGTH)
  @ValidateNested()
  @Type(() => TextContent)
  textContent: TextContent;

  @IsOptional()
  @ValidateNested()
  @Type(() => Image)
  backgroundImage?: Image;
}
