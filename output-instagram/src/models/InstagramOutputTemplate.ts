import {
  IsArray,
  IsObject,
  IsOptional,
  PlatformOutputTemplate,
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

export class InstagramOutputTemplate extends PlatformOutputTemplate<InstagramOutputTemplateResponse> {
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
