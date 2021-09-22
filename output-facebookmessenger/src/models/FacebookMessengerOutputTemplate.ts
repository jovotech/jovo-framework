import {
  IsArray,
  IsObject,
  IsOptional,
  PlatformOutputTemplate,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { TransformQuickReply } from '../decorators/transformation/TransformQuickReply';
import { TransformTemplate } from '../decorators/transformation/TransformTemplate';
import { FacebookMessengerOutputTemplateResponse } from './FacebookMessengerOutputTemplateResponse';
import { QuickReply } from './quick-reply/QuickReply';
import { Template } from './template/Template';

export class FacebookMessengerOutputTemplate extends PlatformOutputTemplate<FacebookMessengerOutputTemplateResponse> {
  @Type(() => FacebookMessengerOutputTemplateResponse)
  nativeResponse?: FacebookMessengerOutputTemplateResponse;

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
