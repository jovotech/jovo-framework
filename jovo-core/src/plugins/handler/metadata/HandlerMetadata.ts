import { BaseComponent, ComponentConstructor } from '../../../BaseComponent';
import { HandleRequest } from '../../../HandleRequest';
import { Intent } from '../../../interfaces';

export interface HandleOptions<COMPONENT extends BaseComponent = BaseComponent> {
  [key: string]: unknown;

  global?: boolean;
  if?: (handleRequest: HandleRequest, component: COMPONENT) => boolean | Promise<boolean>;
  intents?: Array<string | Intent>;
  touch?: string[];
  gestures?: string[];
}

export class HandlerMetadata<
  COMPONENT extends BaseComponent = BaseComponent,
  KEY extends keyof COMPONENT = keyof COMPONENT
> {
  constructor(
    // eslint-disable-next-line @typescript-eslint/ban-types
    readonly target: ComponentConstructor<COMPONENT> | Function,
    readonly propertyKey: KEY,
    readonly descriptor: TypedPropertyDescriptor<COMPONENT[KEY]>,
    readonly options?: HandleOptions<COMPONENT>,
  ) {}

  get intents(): Array<string | Intent> {
    return [this.propertyKey.toString(), ...(this.options?.intents || [])];
  }

  get globalIntentNames(): string[] {
    return this.intents
      .filter((intent) =>
        typeof intent === 'string' ? this.options?.global : intent.global ?? this.options?.global,
      )
      .map((intent) => (typeof intent === 'string' ? intent : intent.name));
  }
}
