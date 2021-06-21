import {
  DynamicEntityValue,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Type,
  ValidateNested,
} from '..';

export enum DynamicEntityMode {
  Replace = 'REPLACE',
  Merge = 'MERGE',
  Clear = 'CLEAR',
}

export type DynamicEntityModeLike = DynamicEntityMode | `${DynamicEntityMode}`;

export class DynamicEntity {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsEnum(DynamicEntityMode)
  mode?: DynamicEntityModeLike;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DynamicEntityValue)
  values: DynamicEntityValue[];
}
