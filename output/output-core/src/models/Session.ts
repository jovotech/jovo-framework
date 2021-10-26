import { IsBoolean, IsObject, IsString, IsOptional, IsArray } from '@jovotech/output';

export class Session {
  @IsString()
  @IsOptional()
  id?: string;

  @IsObject()
  data: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  state?: any[];

  @IsBoolean()
  end: boolean;
}
