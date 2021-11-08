import { IsArray, IsNotEmpty, IsOptional, IsString, Type, ValidateNested } from '@jovotech/output';
import { VersionFilter } from './VersionFilter';

export class AndroidApp {
  @IsString()
  @IsNotEmpty()
  packageName!: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(() => VersionFilter)
  versions?: VersionFilter[];
}
