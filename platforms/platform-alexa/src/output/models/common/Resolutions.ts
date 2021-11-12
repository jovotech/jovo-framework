import { IsArray, IsOptional, Type, ValidateNested } from '@jovotech/output';
import { ResolutionPerAuthority } from './ResolutionPerAuthority';

export class Resolutions {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResolutionPerAuthority)
  resolutionsPerAuthority?: ResolutionPerAuthority[];
}
