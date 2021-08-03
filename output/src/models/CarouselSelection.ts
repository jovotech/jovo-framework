import { IsNotEmpty, IsString } from '..';

export class CarouselSelection {
  @IsString()
  @IsNotEmpty()
  type: string;
}
