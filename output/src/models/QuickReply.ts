import {
  EntityMap,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  TransformMap,
  ValidateNested,
} from '..';
import { Entity } from './Entity';

export type QuickReplyValue = string | QuickReply;

export class QuickReply {
  @IsString()
  @IsNotEmpty()
  text!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  value?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  intent?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested({ each: true })
  @TransformMap(() => Entity)
  entities?: EntityMap;
}
