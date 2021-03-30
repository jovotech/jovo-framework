import { IsBoolean, IsObject } from '@jovotech/output';

export class Session {
  @IsBoolean()
  end: boolean;

  @IsObject()
  data: Record<string, unknown>;
}
