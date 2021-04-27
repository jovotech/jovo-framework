import { BaseComponent, ComponentConstructor } from '../BaseComponent';
import { Intent, JovoConditionFunction } from '../interfaces';

export interface ConditionsOptions {
  [key: string]: unknown;

  if?: JovoConditionFunction;
  platforms?: string[];
}

export interface RoutesOptions {
  [key: string]: unknown;

  global?: boolean;
  subState?: string;
  intents?: Array<string | Intent>;
  touch?: Array<string | Intent>;
  gestures?: Array<string | Intent>;
}

export interface HandleOptions extends ConditionsOptions, RoutesOptions {}

export class HandlerMetadata<
  COMPONENT extends BaseComponent = BaseComponent,
  KEY extends keyof COMPONENT = keyof COMPONENT
> {
  constructor(
    // eslint-disable-next-line @typescript-eslint/ban-types
    readonly target: ComponentConstructor<COMPONENT> | Function,
    readonly propertyKey: KEY,
    readonly options: HandleOptions = {},
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

  get hasCondition(): boolean {
    return !!(this.options?.if || this.options?.platforms?.length);
  }
}
