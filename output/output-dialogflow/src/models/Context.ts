import { IsInt, IsNotEmpty, IsObject, IsOptional, IsString, Min } from '@jovotech/output';
import { CONTEXT_LIFESPAN_COUNT_MIN } from '../constants';

export class Context {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsInt()
  @Min(CONTEXT_LIFESPAN_COUNT_MIN)
  lifespan_count?: number;

  @IsOptional()
  @IsObject()
  parameters?: Record<string, unknown>;
}
