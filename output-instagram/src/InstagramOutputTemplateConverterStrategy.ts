import { FacebookMessengerOutputTemplateConverterStrategy } from '@jovotech/output-facebookmessenger';

export class InstagramOutputTemplateConverterStrategy extends FacebookMessengerOutputTemplateConverterStrategy {
  readonly platformName: string = 'instagram';
}
