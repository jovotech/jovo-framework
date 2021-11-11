import { IsOptional, Type, ValidateNested } from '@jovotech/output';
import { OutputSpeech } from './common/OutputSpeech';

export class Reprompt {
  @IsOptional()
  @ValidateNested()
  @Type(() => OutputSpeech)
  outputSpeech?: OutputSpeech;
}
