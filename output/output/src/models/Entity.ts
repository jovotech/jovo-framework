import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export type EntityMap = Record<string, Entity>;

export class Entity {
  [key: string]: unknown;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  resolved?: string;

  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;

  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  native?: any;
}
