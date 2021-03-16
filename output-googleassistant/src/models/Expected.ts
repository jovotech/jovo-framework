import { ArrayMaxSize, IsArray, IsNotEmpty, IsString } from '@jovotech/output';

export class Expected {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ArrayMaxSize(1000)
  speech: string[];

  @IsString()
  @IsNotEmpty()
  languageCode: string;
}
