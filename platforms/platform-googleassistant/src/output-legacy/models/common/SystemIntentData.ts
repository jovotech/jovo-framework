import { IsNotEmpty, IsOptional, IsString, Type, ValidateNested } from '@jovotech/output';
import { Carousel } from '../collection/Carousel';

export class SystemIntentData {
  @IsString()
  @IsNotEmpty()
  '@type': string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Carousel)
  'carouselSelect'?: Carousel;
}
