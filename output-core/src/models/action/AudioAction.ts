import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { IsArray } from '@jovotech/output';
import { Action, ActionType } from './Action';

export class AudioTrackMeta {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsUrl()
  coverImageUrl?: string;

  @IsOptional()
  @IsUrl()
  backgroundImageUrl?: string;
}

export class AudioTrack {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id?: string;

  @IsUrl()
  src: string;

  @IsOptional()
  @IsInt()
  offsetInMs?: number;

  @IsOptional()
  @IsInt()
  durationInMs?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => AudioTrackMeta)
  metadata?: AudioTrackMeta;
}

export class AudioAction extends Action<ActionType.Audio> {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AudioTrack)
  tracks: AudioTrack[];
}
