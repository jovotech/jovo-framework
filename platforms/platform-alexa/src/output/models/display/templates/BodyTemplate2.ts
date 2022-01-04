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
import { DISPLAY_TEMPLATE_TITLE_MAX_LENGTH } from '../../../constants';
import { Image } from '../../common/Image';
import {
  BackButtonVisibility,
  BackButtonVisibilityLike,
  DisplayTemplate,
  DisplayTemplateType,
} from '../DisplayTemplate';
import { TextContent } from '../TextContent';

export class BodyTemplate2 implements DisplayTemplate<DisplayTemplateType.Body2> {
  @Equals(DisplayTemplateType.Body2)
  type!: DisplayTemplateType.Body2;

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

  @ValidateNested()
  @Type(() => Image)
  image!: Image;

  @ValidateNested()
  @Type(() => TextContent)
  textContent!: TextContent;
}
