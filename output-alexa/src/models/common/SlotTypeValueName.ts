import { IsArray, IsNotEmpty, IsOptional, IsString } from '@jovotech/output';

export class SlotTypeValueName {
  @IsString()
  @IsNotEmpty()
  value: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  synonyms?: string[];
}
