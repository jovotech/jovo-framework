import { IsNotEmpty, IsString } from '..';

export class CarouselSelection {
  @IsString()
  @IsNotEmpty()
  entityType!: string;

  @IsString()
  @IsNotEmpty()
  intent!: string;
}
