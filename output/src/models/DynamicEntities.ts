import { DynamicEntity, IsArray, IsEnum, IsOptional, Type, ValidateNested } from '..';

export enum DynamicEntitiesMode {
  Replace = 'REPLACE',
  Merge = 'MERGE',
  Clear = 'CLEAR',
}

export type DynamicEntitiesModeLike = DynamicEntitiesMode | `${DynamicEntitiesMode}`;

export class DynamicEntities {
  @IsOptional()
  @IsEnum(DynamicEntitiesMode)
  mode?: DynamicEntitiesModeLike;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DynamicEntity)
  types?: DynamicEntity[];
}
