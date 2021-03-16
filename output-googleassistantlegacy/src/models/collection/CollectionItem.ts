import { IsNotEmpty, IsOptional, IsString, Type, ValidateNested } from '@jovotech/output';
import { Image } from '../common/Image';
import { OptionInfo } from './OptionInfo';

export class CollectionItem {
  @ValidateNested()
  @Type(() => OptionInfo)
  optionInfo: OptionInfo;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Image)
  image?: Image;
}
