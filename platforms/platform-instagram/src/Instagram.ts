import { FacebookMessenger } from '@jovotech/platform-facebookmessenger';

export class Instagram extends FacebookMessenger {
  get pageAccessToken(): string | undefined {
    return this.$handleRequest.config.plugin?.InstagramPlatform?.pageAccessToken;
  }
}
