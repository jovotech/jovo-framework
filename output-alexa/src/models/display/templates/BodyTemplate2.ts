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
import { Image } from '../../common/Image';
import { BackButtonVisibility, DisplayTemplate, DisplayTemplateType } from '../DisplayTemplate';
import { TextContent } from '../TextContent';

export class BodyTemplate2 implements DisplayTemplate<DisplayTemplateType.Body2> {
  @Equals(DisplayTemplateType.Body2)
  type: DisplayTemplateType.Body2;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsOptional()
  BackButtonVisibility)
  backButton?: BackButtonVisibility;

  @IsOptional()
  @ValidateNested()
  @Type(() => Image)
  backgroundImage?: Image;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ValidateNested()
  @Type(() => Image)
  image: Image;

  @ValidateNested()
  @Type(() => TextContent)
  textContent: TextContent;
}
