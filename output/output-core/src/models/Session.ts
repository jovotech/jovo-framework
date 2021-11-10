import { IsBoolean, IsObject, IsString, IsOptional } from '@jovotech/output';

export class Session {
  @IsString()
  @IsOptional()
  id?: string;

  @IsBoolean()
  end: boolean;

  @IsObject()
  data: Record<string, unknown>;
}
