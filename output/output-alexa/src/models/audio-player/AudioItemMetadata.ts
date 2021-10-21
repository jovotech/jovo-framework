import { IsOptional, Type, ValidateNested } from '@jovotech/output';
import { Image } from '../common/Image';
import { Metadata } from '../common/Metadata';

export class AudioItemMetadata extends Metadata {
  @IsOptional()
  @ValidateNested()
  @Type(() => Image)
  art?: Image;

  @IsOptional()
  @ValidateNested()
  @Type(() => Image)
  backgroundImage?: Image;
}
