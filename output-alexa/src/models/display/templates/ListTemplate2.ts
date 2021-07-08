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
import { BackButtonVisibility, BackButtonVisibilityLike, DisplayTemplate, DisplayTemplateType } from '../DisplayTemplate';
import { DisplayTemplateList1Item } from '../list-items/DisplayTemplateList1Item';
import { DisplayTemplateList2Item } from '../list-items/DisplayTemplateList2Item';

export class ListTemplate2 implements DisplayTemplate<DisplayTemplateType.List2> {
  @Equals(DisplayTemplateType.List2)
  type: DisplayTemplateType.List2;

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
  @Type(() => DisplayTemplateList2Item)
  listItems: DisplayTemplateList2Item[];
}
