import { FacebookMessengerOutputTemplateConverterStrategy } from '@jovotech/output-facebookmessenger';

export class InstagramOutputTemplateConverterStrategy extends FacebookMessengerOutputTemplateConverterStrategy {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  platformName = 'instagram' as const;
}
