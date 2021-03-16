import { IsInt, IsOptional } from '@jovotech/output';

export class VersionFilter {
  @IsOptional()
  @IsInt()
  minVersion?: number;
  @IsOptional()
  @IsInt()
  maxVersion?: number;
}
