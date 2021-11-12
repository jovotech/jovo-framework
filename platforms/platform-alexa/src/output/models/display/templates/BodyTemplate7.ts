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

export class BodyTemplate7 implements DisplayTemplate<DisplayTemplateType.Body7> {
  @Equals(DisplayTemplateType.Body7)
  type!: DisplayTemplateType.Body7;

  @IsString()
  @IsNotEmpty()
  token!: string;

  @IsOptional()
  @IsEnum(BackButtonVisibility)
  backButton?: BackButtonVisibilityLike;

  @IsString()
  @IsNotEmpty()
  @MaxLength(DISPLAY_TEMPLATE_TITLE_MAX_LENGTH)
  title!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Image)
  backgroundImage?: Image;

  @ValidateNested()
  @Type(() => Image)
  image!: Image;
}
