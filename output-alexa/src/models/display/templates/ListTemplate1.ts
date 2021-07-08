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
import { Image } from '../../common/Image';
import {
  BackButtonVisibility,
  BackButtonVisibilityLike,
  DisplayTemplate,
  DisplayTemplateType,
} from '../DisplayTemplate';
import { DisplayTemplateList1Item } from '../list-items/DisplayTemplateList1Item';

export class ListTemplate1 implements DisplayTemplate<DisplayTemplateType.List1> {
  @Equals(DisplayTemplateType.List1)
  type: DisplayTemplateType.List1;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsOptional()
  @IsEnum(BackButtonVisibility)
  backButton?: BackButtonVisibilityLike;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Image)
  backgroundImage?: Image;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({
    each: true,
  })
  @Type(() => DisplayTemplateList1Item)
  listItems: DisplayTemplateList1Item[];
}
