import { IsObject } from '@jovotech/output';

export class User {
  @IsObject()
  data: Record<string, unknown>;
}
