import { DebuggerButton } from './index';

export class DebuggerConfig {
  locales: string[] = ['en'];
  buttons?: DebuggerButton[];

  constructor(config?: Partial<DebuggerConfig>) {
    if (config?.locales?.length) {
      this.locales = config.locales;
    }
    if (config?.buttons) {
      this.buttons = config.buttons;
    }
  }
}
