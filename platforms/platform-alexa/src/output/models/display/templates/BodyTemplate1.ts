import {
  Equals,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Type,
  ValidateNested,
} from '@jovotech/output';
import {
  BODY_TEMPLATE_MAIN_TEXT_MAX_LENGTH,
  DISPLAY_TEMPLATE_TITLE_MAX_LENGTH,
} from '../../../constants';
import { MainTextMaxLength } from '../../../decorators/validation/MainTextMaxLength';
import { Image } from '../../common/Image';
import {
  BackButtonVisibility,
  BackButtonVisibilityLike,
  DisplayTemplate,
  DisplayTemplateType,
} from '../DisplayTemplate';
import { TextContent } from '../TextContent';

export class BodyTemplate1 implements DisplayTemplate<DisplayTemplateType.Body1> {
  @Equals(DisplayTemplateType.Body1)
  type!: DisplayTemplateType.Body1;

  @IsString()
  @IsNotEmpty()
  token!: string;

  @IsOptional()
  @IsEnum(BackButtonVisibility)
  backButton?: BackButtonVisibilityLike;

  @IsOptional()
  @ValidateNested()
  @Type(() => Image)
  backgroundImage?: Image;

  @IsString()
  @IsNotEmpty()
  @MaxLength(DISPLAY_TEMPLATE_TITLE_MAX_LENGTH)
  title!: string;

  @MainTextMaxLength(BODY_TEMPLATE_MAIN_TEXT_MAX_LENGTH)
  @ValidateNested()
  @Type(() => TextContent)
  textContent!: TextContent;
}
