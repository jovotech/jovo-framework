import { FacebookMessengerOutputTemplateConverterStrategy } from '@jovotech/platform-facebookmessenger';
import { InstagramResponse } from '../InstagramResponse';

export class InstagramOutputTemplateConverterStrategy extends FacebookMessengerOutputTemplateConverterStrategy {
  responseClass = InstagramResponse;
  readonly platformName = 'instagram';
}
