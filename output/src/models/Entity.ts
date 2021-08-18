import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export type EntityMap = Record<string, Entity>;

export class Entity {
  [key: string]: unknown;
  
  @IsString()
  @IsNotEmpty()
  value: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  key?: string;
}
