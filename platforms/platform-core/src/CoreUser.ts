import { JovoUser } from '@jovotech/framework';
import { Core } from './Core';

export class CoreUser extends JovoUser<Core> {
  constructor(jovo: Core) {
    super(jovo);
  }

  get id(): string | undefined {
    return this.jovo.$request.context?.user?.id;
  }
}
