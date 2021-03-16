import { IsEnum, IsNotEmpty, IsOptional, IsString } from '@jovotech/output';

export enum HtmlTransformer {
  SsmlToSpeech = 'ssmlToSpeech',
  TextToSpeech = 'textToSpeech',
}

export class HtmlTransformers {
  @IsString()
  @IsNotEmpty()
  inputPath: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  outputName?: string;

  @IsEnum(HtmlTransformer)
  transformer: HtmlTransformer;
}
