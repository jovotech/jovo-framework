import { IsNotEmpty, IsOptional, IsString, Type, ValidateNested } from '@jovotech/output';
import { LegacyImage } from '../common/LegacyImage';
import { OptionInfo } from './OptionInfo';

export class LegacyCollectionItem {
  @ValidateNested()
  @Type(() => OptionInfo)
  optionInfo!: OptionInfo;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LegacyImage)
  image?: LegacyImage;
}
