import {
  IsObject,
  IsOptional,
  PlatformOutputTemplate,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { TransformTemplate } from '../decorators/transformation/TransformTemplate';
import { FacebookMessengerOutputTemplateResponse } from './FacebookMessengerOutputTemplateResponse';
import { Template } from './template/Template';

export class FacebookMessengerOutputTemplate extends PlatformOutputTemplate<FacebookMessengerOutputTemplateResponse> {
  @Type(() => FacebookMessengerOutputTemplateResponse)
  nativeResponse?: FacebookMessengerOutputTemplateResponse;
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @TransformTemplate()
  template?: Template;
}
