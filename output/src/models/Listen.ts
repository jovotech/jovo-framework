import { IsArray, IsOptional, Type, ValidateNested } from '..';
import { DynamicEntity } from './DynamicEntity';

export type ListenValue = boolean | Listen;

export class Listen {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DynamicEntity)
  entities?: DynamicEntity[];
}
