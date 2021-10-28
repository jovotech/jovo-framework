import { IsObject, IsString, IsOptional } from '@jovotech/output';

export class User {
  @IsString()
  @IsOptional()
  id?: string;

  @IsObject()
  data: Record<string, unknown>;
}
