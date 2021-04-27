import { HandleRequest } from '../HandleRequest';
import { ExtensibleConfig, JovoSession } from '../index';
import { Jovo } from '../Jovo';
import { Plugin } from '../Plugin';

export interface SessionPluginConfig extends ExtensibleConfig {}
export class SessionPlugin extends Plugin<SessionPluginConfig> {
  getDefaultConfig() {
    return {};
  }

  mount(handleRequest: HandleRequest): Promise<void> | void {
    handleRequest.middlewareCollection.use('before.interpretation.asr', this.sessionHandling);
    return undefined;
  }

  sessionHandling(handleRequest: HandleRequest, jovo: Jovo): void {
    if (jovo.isNewSession()) {
      jovo.$session = new JovoSession();
    } else {
      jovo.$session.updatedAt = new Date();
      jovo.$session.isNew = false;
    }
  }
}
