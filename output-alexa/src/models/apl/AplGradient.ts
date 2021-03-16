import {
  IsInt,
  IsOptional,
  Min,
  Max,
  IsArray,
  IsEnum,
  ArrayMinSize,
  IsString,
  IsNotEmpty,
  IsNumber,
} from '@jovotech/output';

export enum AplGradientType {
  Linear = 'linear',
  Radial = 'radial',
}
export class AplGradient {
  [key: string]: unknown;

  @IsOptional()
  @IsEnum(AplGradientType)
  type?: AplGradientType;

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
