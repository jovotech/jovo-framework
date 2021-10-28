import {
  Entity,
  EntityMap,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  TransformMap,
  ValidateNested,
} from '..';

export class CarouselItemSelection {
  @IsString()
  @IsNotEmpty()
  intent: string;

  @IsOptional()
  @IsObject()
  @ValidateNested({ each: true })
  @TransformMap(() => Entity)
  entities?: EntityMap;
}
