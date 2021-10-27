import { EventEmitter } from 'events';
import { AnyListener, ErrorListener } from '../interfaces';

export interface EventListenerMap {
  [key: string]: AnyListener;
  error: ErrorListener;
}

export class TypedEventEmitter<EVENT_LISTENER_MAP extends EventListenerMap> {
  static listenerCount<
    EVENT_LISTENER_MAP extends EventListenerMap,
    EVENT extends keyof EVENT_LISTENER_MAP,
  >(emitter: TypedEventEmitter<EVENT_LISTENER_MAP>, type: EVENT): number {
    return EventEmitter.listenerCount(emitter.eventEmitter, type as string | symbol);
  }

  static get defaultMaxListeners(): number {
    return EventEmitter.defaultMaxListeners;
  }

  static set defaultMaxListeners(value: number) {
    EventEmitter.defaultMaxListeners = value;
  }

  private eventEmitter: EventEmitter = new EventEmitter();

  eventNames(): Array<keyof EVENT_LISTENER_MAP> {
    return this.eventEmitter.eventNames() as Array<keyof EVENT_LISTENER_MAP>;
  }

  setMaxListeners(amount: number): this {
    this.eventEmitter.setMaxListeners(amount);
    return this;
  }

  getMaxListeners(): number {
    return this.eventEmitter.getMaxListeners();
  }

  emit<EVENT extends keyof EVENT_LISTENER_MAP>(
    type: EVENT,
    ...args: Parameters<EVENT_LISTENER_MAP[EVENT]>
  ): boolean {
    return this.eventEmitter.emit(type as string | symbol, ...args);
  }

  addListener<EVENT extends keyof EVENT_LISTENER_MAP>(
    type: EVENT,
    listener: EVENT_LISTENER_MAP[EVENT],
  ): this {
    this.eventEmitter.addListener(type as string | symbol, listener);
    return this;
  }

  on<EVENT extends keyof EVENT_LISTENER_MAP>(
    type: EVENT,
    listener: EVENT_LISTENER_MAP[EVENT],
  ): this {
    this.eventEmitter.on(type as string | symbol, listener);
    return this;
  }

  once<EVENT extends keyof EVENT_LISTENER_MAP>(
    type: EVENT,
    listener: EVENT_LISTENER_MAP[EVENT],
  ): this {
    this.eventEmitter.once(type as string | symbol, listener);
    return this;
  }

  prependListener<EVENT extends keyof EVENT_LISTENER_MAP>(
    type: EVENT,
    listener: EVENT_LISTENER_MAP[EVENT],
  ): this {
    this.eventEmitter.prependListener(type as string | symbol, listener);
    return this;
  }

  prependOnceListener<EVENT extends keyof EVENT_LISTENER_MAP>(
    type: EVENT,
    listener: EVENT_LISTENER_MAP[EVENT],
  ): this {
    this.eventEmitter.prependOnceListener(type as string | symbol, listener);
    return this;
  }

  removeListener<EVENT extends keyof EVENT_LISTENER_MAP>(
    type: EVENT,
    listener: EVENT_LISTENER_MAP[EVENT],
  ): this {
    this.eventEmitter.removeListener(type as string | symbol, listener);
    return this;
  }

  off<EVENT extends keyof EVENT_LISTENER_MAP>(
    type: EVENT,
    listener: EVENT_LISTENER_MAP[EVENT],
  ): this {
    this.eventEmitter.off(type as string | symbol, listener);
    return this;
  }

  removeAllListeners<EVENT extends keyof EVENT_LISTENER_MAP>(type?: EVENT): this {
    this.eventEmitter.removeAllListeners(type as string | symbol);
    return this;
  }

  listeners<EVENT extends keyof EVENT_LISTENER_MAP>(type: EVENT): EVENT_LISTENER_MAP[EVENT][] {
    return this.eventEmitter.listeners(type as string | symbol) as EVENT_LISTENER_MAP[EVENT][];
  }

  listenerCount<EVENT extends keyof EVENT_LISTENER_MAP>(type: EVENT): number {
    return this.eventEmitter.listenerCount(type as string | symbol);
  }

  rawListeners<EVENT extends keyof EVENT_LISTENER_MAP>(type: EVENT): EVENT_LISTENER_MAP[EVENT][] {
    return this.eventEmitter.rawListeners(type as string | symbol) as EVENT_LISTENER_MAP[EVENT][];
  }
}
