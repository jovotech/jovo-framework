import {
  IsArray,
  IsObject,
  IsOptional,
  NormalizedPlatformOutputTemplate,
  Type,
  ValidateNested,
} from '@jovotech/output';
import {
  QuickReply,
  Template,
  TransformQuickReply,
  TransformTemplate,
} from '@jovotech/output-facebookmessenger';
import { InstagramOutputTemplateResponse } from './InstagramOutputTemplateResponse';

export class NormalizedInstagramOutputTemplate extends NormalizedPlatformOutputTemplate<InstagramOutputTemplateResponse> {
  @Type(() => InstagramOutputTemplateResponse)
  nativeResponse?: InstagramOutputTemplateResponse;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @TransformQuickReply()
  nativeQuickReplies?: QuickReply[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @TransformTemplate()
  template?: Template;
}
