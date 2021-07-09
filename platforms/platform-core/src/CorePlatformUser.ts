import { JovoUser } from '@jovotech/framework';

export class CorePlatformUser extends JovoUser {
  get id(): string {
    return 'coreplatformuser';
  }
}
