import { IsNotEmpty, IsOptional, IsString, Type, ValidateNested } from '@jovotech/output';
import { Image } from '../common/Image';
import { OpenUrlAction } from '../common/OpenUrlAction';

export class Item {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  footer?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Image)
  image?: Image;

  @ValidateNested()
  @Type(() => OpenUrlAction)
  openUrlAction: OpenUrlAction;
}
