import { IsBoolean, IsObject, IsString } from '@jovotech/output';

export class Session {
  @IsString()
  id?: string;

  @IsBoolean()
  end: boolean;

  @IsObject()
  data: Record<string, unknown>;
}
