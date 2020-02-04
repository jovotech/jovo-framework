import { EventEmitter } from 'events';

export class AdvancedEventEmitter extends EventEmitter {
  // tslint:disable-next-line:no-any
  onEmit?: (type: string | symbol, ...args: any[]) => void;

  constructor() {
    super();
  }

  // tslint:disable-next-line:no-any
  emit(type: string | symbol, ...args: any[]): boolean {
    if (this.onEmit) {
      this.onEmit(type, ...args);
    }
    return super.emit(type, ...args);
  }
}
