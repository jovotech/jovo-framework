import { IsObject, IsString } from '@jovotech/output';

export class User {
  @IsString()
  id?: string;

  @IsObject()
  data: Record<string, unknown>;
}
