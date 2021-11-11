import { ArrayMaxSize, IsArray, IsNotEmpty, IsString } from '@jovotech/output';
import { EXPECTED_SPEECH_MAX_SIZE } from '../constants';

export class Expected {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ArrayMaxSize(EXPECTED_SPEECH_MAX_SIZE)
  speech!: string[];

  @IsString()
  @IsNotEmpty()
  languageCode!: string;
}
