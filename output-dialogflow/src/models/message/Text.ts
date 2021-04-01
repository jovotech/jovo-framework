import { ArrayMaxSize, IsArray, IsNotEmpty, IsOptional, IsString, Message } from '@jovotech/output';

export class Text {
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(300)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  text?: string[];

  toMessage?(): Message {
    return {
      text: this.text?.[0] || '',
    };
  }
}
