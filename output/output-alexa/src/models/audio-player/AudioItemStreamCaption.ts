import { IsNotEmpty, IsOptional, IsString } from '@jovotech/output';

export class AudioItemStreamCaption {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  type?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;
}
