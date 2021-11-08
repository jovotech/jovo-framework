import { IsArray, ValidateNested, IsEnum, Type } from '@jovotech/output';
import { LegacyMediaObject } from './LegacyMediaObject';

export enum LegacyMediaType {
  Unspecified = 'MEDIA_TYPE_UNSPECIFIED',
  Audio = 'AUDIO',
}

export class MediaResponse {
  @IsEnum(LegacyMediaType)
  mediaType!: LegacyMediaType;

  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(() => LegacyMediaObject)
  mediaObjects!: LegacyMediaObject[];
}
