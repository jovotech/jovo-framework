import { ArrayUnique, IsArray, IsNotEmpty, IsString } from '@jovotech/output';

export class OptionInfo {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  synonyms: string[];
}
