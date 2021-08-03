import { Entity, IsArray, IsNotEmpty, IsOptional, IsString, Type, ValidateNested } from '..';

export class CarouselItemSelection {
  @IsString()
  @IsNotEmpty()
  intent: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Entity)
  entities?: Entity[];
}
