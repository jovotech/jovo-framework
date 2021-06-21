import { IsEnum, IsOptional, MessageValue, removeSSMLSpeakTags } from '@jovotech/output';
import { IsValidOutputSpeechString } from '../../decorators/validation/IsValidOutputSpeechString';

export enum OutputSpeechType {
  Plain = 'PlainText',
  Ssml = 'SSML',
}

export type OutputSpeechTypeLike = OutputSpeechType | `${OutputSpeechType}`;

export enum PlayBehavior {
  Enqueue = 'ENQUEUE',
  ReplaceAll = 'REPLACE_ALL',
  ReplaceEnqueued = 'REPLACE_ENQUEUED',
}

export class OutputSpeech<TYPE extends OutputSpeechTypeLike = OutputSpeechTypeLike> {
  @IsEnum(OutputSpeechType)
  type: TYPE;

  @IsValidOutputSpeechString(OutputSpeechType.Plain)
  text?: TYPE extends OutputSpeechType.Plain
    ? string
    : TYPE extends OutputSpeechType.Ssml
    ? undefined
    : string | undefined;

  @IsValidOutputSpeechString(OutputSpeechType.Ssml)
  ssml?: TYPE extends OutputSpeechType.Ssml
    ? string
    : TYPE extends OutputSpeechType.Plain
    ? undefined
    : string | undefined;

  @IsOptional()
  @IsEnum(PlayBehavior)
  playBehavior?: PlayBehavior;

  toMessage?(): MessageValue {
    return this.type === OutputSpeechType.Plain
      ? ((this.text || '') as string)
      : removeSSMLSpeakTags((this.ssml || '') as string);
  }
}
