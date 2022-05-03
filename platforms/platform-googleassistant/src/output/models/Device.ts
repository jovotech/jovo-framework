import { EnumLike } from '@jovotech/framework';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Type,
  ValidateNested,
} from '@jovotech/output';

export enum Capability {
  Unspecified = 'UNSPECIFIED',
  Speech = 'SPEECH',
  RichResponse = 'RICH_RESPONSE',
  LongFormAudio = 'LONG_FORM_AUDIO',
  InteractiveCanvas = 'INTERACTIVE_CANVAS',
  WebLink = 'WEB_LINK',
}

export type CapabilityLike = EnumLike<Capability>;

export class TimeZone {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsOptional()
  @IsString()
  version?: string;
}
export class Device {
  @IsArray()
  @IsEnum(Capability, { each: true })
  capabilities!: CapabilityLike[];

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => TimeZone)
  timeZone?: TimeZone;
}
