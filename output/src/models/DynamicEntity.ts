import { DynamicEntityValue, IsArray, Type, ValidateNested } from '..';

export class DynamicEntity {
  [key: string]: unknown;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DynamicEntityValue)
  values!: DynamicEntityValue[];
}
