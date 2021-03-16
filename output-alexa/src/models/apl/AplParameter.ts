import { IsEnum, IsNotEmpty, IsOptional, IsString } from '@jovotech/output';

export enum AplType {
  Any = 'any',
  Array = 'array',
  Boolean = 'boolean',
  Color = 'color',
  Component = 'component',
  Dimension = 'dimension',
  Integer = 'integer',
  Map = 'map',
  Number = 'number',
  Object = 'object',
  String = 'string',
}

export class AplParameter {
  @IsOptional()
  @IsEnum(AplType)
  type?: AplType;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  default?: any;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;
}
