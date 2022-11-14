import { DynamicEntities, IsOptional, Type, ValidateNested } from '..';

export type ListenValue = boolean | Listen;

export class Listen {
  @IsOptional()
  @ValidateNested()
  @Type(() => DynamicEntities)
  entities?: DynamicEntities;

  @IsOptional()
  intents?: string[];
}
