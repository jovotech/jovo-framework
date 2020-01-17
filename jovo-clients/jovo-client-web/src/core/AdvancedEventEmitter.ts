import { EventEmitter } from 'events';

export class AdvancedEventEmitter extends EventEmitter {
  onEmit?: (type: string | symbol, ...args: any[]) => void;

  constructor() {
    super();
  }

  emit(type: string | symbol, ...args: any[]): boolean {
    if (this.onEmit) {
      this.onEmit(type, ...args);
    }
    return super.emit(type, ...args);
  }
}
