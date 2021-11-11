import {
  ArrayMinSize,
  Equals,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { LIST_TEMPLATE_MIN_SIZE, DISPLAY_TEMPLATE_TITLE_MAX_LENGTH } from '../../../constants';
import { Image } from '../../common/Image';
import {
  BackButtonVisibility,
  BackButtonVisibilityLike,
  DisplayTemplate,
  DisplayTemplateType,
} from '../DisplayTemplate';
import { DisplayTemplateList2Item } from '../list-items/DisplayTemplateList2Item';

export class ListTemplate2 implements DisplayTemplate<DisplayTemplateType.List2> {
  @Equals(DisplayTemplateType.List2)
  type!: DisplayTemplateType.List2;

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

  @IsArray()
  @ArrayMinSize(LIST_TEMPLATE_MIN_SIZE)
  @ValidateNested({
    each: true,
  })
  @Type(() => DisplayTemplateList2Item)
  listItems!: DisplayTemplateList2Item[];
}
