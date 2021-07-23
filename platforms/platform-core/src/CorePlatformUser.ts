import { JovoUser } from '@jovotech/framework';
import { Core } from './Core';

export class CorePlatformUser extends JovoUser<Core> {
  constructor(jovo: Core) {
    super(jovo);
  }

  get id(): string {
    return 'coreplatformuser';
  }
}
