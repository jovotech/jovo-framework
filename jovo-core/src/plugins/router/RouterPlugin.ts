import { App } from '../../App';
import { Plugin } from '../../Plugin';

export class RouterPlugin extends Plugin {
  getDefaultConfig() {
    return {};
  }

  mount(parent: App): Promise<void> | void {
    return;
  }
}
