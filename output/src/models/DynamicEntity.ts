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

export class DynamicEntity {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DynamicEntityValue)
  values?: DynamicEntityValue[];
}
