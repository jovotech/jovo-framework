import { IsObject, IsString, IsOptional } from '@jovotech/output';

export class CoreResponseUser {
  @IsString()
  @IsOptional()
  id?: string;

  @IsObject()
  data!: Record<string, unknown>;
}
