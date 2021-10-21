import { IsOptional, IsString } from '@jovotech/output';

import { IsObject } from '@jovotech/output';

export class Home {
  @IsOptional()
  @IsObject()
  params?: Record<string, unknown>;
}
