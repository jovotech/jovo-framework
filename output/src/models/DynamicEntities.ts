import { EnumLike } from '@jovotech/common';
import { DynamicEntity, IsEnum, IsObject, IsOptional, TransformMap, ValidateNested } from '..';

export enum DynamicEntitiesMode {
  Replace = 'REPLACE',
  Merge = 'MERGE',
  Clear = 'CLEAR',
}

export type DynamicEntitiesModeLike = EnumLike<DynamicEntitiesMode>;

export type DynamicEntityMap = Record<string, DynamicEntity>;

export class DynamicEntities {
  @IsOptional()
  @IsEnum(DynamicEntitiesMode)
  mode?: DynamicEntitiesModeLike;

  @IsOptional()
  @IsObject()
  @ValidateNested({ each: true })
  @TransformMap(() => DynamicEntity)
  types?: DynamicEntityMap;
}
