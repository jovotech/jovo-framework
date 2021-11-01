import { IsArray, ValidateNested, IsEnum, Type } from '@jovotech/output';
import { MediaObject } from './MediaObject';

export enum MediaType {
  Unspecified = 'MEDIA_TYPE_UNSPECIFIED',
  Audio = 'AUDIO',
}

export class MediaResponse {
  @IsEnum(MediaType)
  mediaType: MediaType;

  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(() => MediaObject)
  mediaObjects: MediaObject[];
}
