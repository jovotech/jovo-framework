import {
  IsOptional,
  IsString,
  NormalizedPlatformOutputTemplate,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { GoogleBusinessOutputTemplateResponse } from './GoogleBusinessOutputTemplateResponse';
import { Image } from './Image';
import { Suggestion } from './Suggestion';

export class NormalizedGoogleBusinessOutputTemplate extends NormalizedPlatformOutputTemplate<GoogleBusinessOutputTemplateResponse> {
  @Type(() => GoogleBusinessOutputTemplateResponse)
  nativeResponse?: GoogleBusinessOutputTemplateResponse;

  @IsOptional()
  @IsString()
  fallback?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Image)
  image?: Image;

  @IsOptional()
  @ValidateNested()
  @Type(() => Suggestion)
  suggestions?: Suggestion[];
}
