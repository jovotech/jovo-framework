import { FacebookMessenger } from '@jovotech/platform-facebookmessenger';

export class Instagram extends FacebookMessenger {
  get pageAccessToken(): string | undefined {
    return this.$config.plugin?.InstagramPlatform?.pageAccessToken;
  }
}
