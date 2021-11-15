import { IsNotEmpty, IsOptional, IsString, Type, ValidateNested } from '@jovotech/output';
import { ImageSource } from './ImageSource';

export class Image {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  contentDescription?: string;

  @ValidateNested({ each: true })
  @Type(() => ImageSource)
  sources!: ImageSource[];
}
