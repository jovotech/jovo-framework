import {
  IsBoolean,
  IsNotEmpty,
  IsOfEitherType,
  IsOptional,
  IsString,
  TransformMap,
  ValidateNested,
} from '@jovotech/output';
import { AplGradient } from './AplGradient';

export class AplResource {
  @IsOptional()
  @IsOfEitherType(['string', 'boolean'])
  when?: string | boolean;

  @IsOptional()
  @IsBoolean({ each: true })
  boolean?: Record<string, boolean>;
  @IsOptional()
  @IsBoolean({ each: true })
  booleans?: Record<string, boolean>;

  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  color?: Record<string, string>;
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  colors?: Record<string, string>;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  dimension?: Record<string, string>;
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  dimensions?: Record<string, string>;

  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  easing?: Record<string, string>;
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  easings?: Record<string, string>;

  @IsOptional()
  @ValidateNested({ each: true })
  @TransformMap(() => AplGradient)
  gradient?: Record<string, AplGradient>;
  @TransformMap(() => AplGradient)
  @ValidateNested({ each: true })
  @IsOptional()
  gradients?: Record<string, AplGradient>;

  @IsOptional()
  @IsOfEitherType(['string', 'number'], { each: true })
  number?: Record<string, number | string>;
  @IsOptional()
  @IsOfEitherType(['string', 'number'], { each: true })
  numbers?: Record<string, number | string>;

  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  string?: Record<string, string>;
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  strings?: Record<string, string>;
}
