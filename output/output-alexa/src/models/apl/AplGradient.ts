import {
  ArrayMinSize,
  EnumLike,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from '@jovotech/output';
import {
  APL_GRADIENT_COLOR_RANGE_MIN_SIZE,
  APL_GRADIENT_INPUT_RANGE_MAX,
  APL_GRADIENT_INPUT_RANGE_MIN,
} from '../../constants';

export enum AplGradientType {
  Linear = 'linear',
  Radial = 'radial',
}

export type AplGradientTypeLike = EnumLike<AplGradientType>;

export class AplGradient {
  [key: string]: unknown;

  @IsOptional()
  @IsEnum(AplGradientType)
  type?: AplGradientTypeLike;

  @IsOptional()
  @IsInt()
  angle?: number;

  @IsArray()
  @ArrayMinSize(APL_GRADIENT_COLOR_RANGE_MIN_SIZE)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  colorRange: string[];

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(APL_GRADIENT_INPUT_RANGE_MIN, {
    each: true,
  })
  @Max(APL_GRADIENT_INPUT_RANGE_MAX, {
    each: true,
  })
  inputRange?: number[];
}
