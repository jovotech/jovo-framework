import { AnyObject, EnumLike } from '@jovotech/framework';
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

export type AplTypeLike = EnumLike<AplType>;

export class AplParameter {
  @IsOptional()
  @IsEnum(AplType)
  type?: AplTypeLike;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  default?: AnyObject;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;
}
