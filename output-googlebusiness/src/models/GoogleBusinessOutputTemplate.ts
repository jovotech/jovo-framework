import {
  IsOptional,
  IsString,
  PlatformOutputTemplate,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { GoogleBusinessOutputTemplateResponse } from './GoogleBusinessOutputTemplateResponse';
import { Image } from './Image';
import { Suggestion } from './Suggestion';

export class GoogleBusinessOutputTemplate extends PlatformOutputTemplate<GoogleBusinessOutputTemplateResponse> {
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
