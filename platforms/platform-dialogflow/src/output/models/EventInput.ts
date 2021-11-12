import { IsNotEmpty, IsObject, IsOptional, IsString } from '@jovotech/output';

export class EventInput {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsObject()
  parameters?: Record<string, unknown>;

  @IsString()
  @IsNotEmpty()
  language_code!: string;
}
