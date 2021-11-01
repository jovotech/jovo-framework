import { IsArray, IsNotEmpty, IsOptional, IsString } from '..';

export class DynamicEntityValue {
  @IsString()
  @IsNotEmpty()
  value: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  synonyms?: string[];
}
