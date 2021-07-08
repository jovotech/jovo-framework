import {
  Equals,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { MainTextMaxLength } from '../../../decorators/validation/MainTextMaxLength';
import { Image } from '../../common/Image';
import {
  BackButtonVisibility,
  BackButtonVisibilityLike,
  DisplayTemplate,
  DisplayTemplateType,
} from '../DisplayTemplate';
import { TextContent } from '../TextContent';

export class BodyTemplate6 implements DisplayTemplate<DisplayTemplateType.Body6> {
  @Equals(DisplayTemplateType.Body6)
  type: DisplayTemplateType.Body6;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsOptional()
  @IsEnum(BackButtonVisibility)
  backButton?: BackButtonVisibilityLike;

  @IsOptional()
  @ValidateNested()
  @Type(() => Image)
  backgroundImage?: Image;

  @ValidateNested()
  @Type(() => Image)
  image: Image;

  @MainTextMaxLength(85)
  @ValidateNested()
  @Type(() => TextContent)
  textContent: TextContent;
}
