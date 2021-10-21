import { FacebookMessengerOutputTemplateConverterStrategy } from '@jovotech/output-facebookmessenger';
import { InstagramResponse } from './models';

export class InstagramOutputTemplateConverterStrategy extends FacebookMessengerOutputTemplateConverterStrategy {
  responseClass = InstagramResponse;
  readonly platformName = 'instagram';
}
