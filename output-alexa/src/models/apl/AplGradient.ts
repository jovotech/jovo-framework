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
  @ArrayMinSize(2)
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
  @Min(0, {
    each: true,
  })
  @Max(1, {
    each: true,
  })
  inputRange?: number[];
}
