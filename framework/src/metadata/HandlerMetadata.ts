import { BaseComponent, ComponentConstructor } from '../BaseComponent';
import { InternalIntent } from '../enums';
import { Intent, JovoConditionFunction } from '../interfaces';
import { HandlerOptionMetadata } from './HandlerOptionMetadata';
import { MethodDecoratorMetadata } from './MethodDecoratorMetadata';

export interface ConditionsOptions {
  if?: JovoConditionFunction;
  platforms?: string[];
}

export interface RoutesOptions {
  global?: boolean;
  subState?: string;
  intents?: Array<string | Intent>;
  touch?: Array<string | Intent>;
  gestures?: Array<string | Intent>;
  prioritizedOverUnhandled?: boolean;
}

export interface HandleOptions extends ConditionsOptions, RoutesOptions {
  [key: string]: unknown;
}

export class HandlerMetadata<
  COMPONENT extends BaseComponent = BaseComponent,
  KEY extends keyof COMPONENT = keyof COMPONENT,
> extends MethodDecoratorMetadata<COMPONENT, KEY> {
  constructor(
    // eslint-disable-next-line @typescript-eslint/ban-types
    readonly target: ComponentConstructor<COMPONENT> | Function,
    readonly propertyKey: KEY,
    readonly options: HandleOptions = {},
  ) {
    super(target, propertyKey);
  }

  get intents(): Array<string | Intent> {
    return [this.propertyKey.toString(), ...(this.options?.intents || [])];
  }

  get intentNames(): string[] {
    return this.intents.map((intent) => (typeof intent === 'string' ? intent : intent.name));
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

  mergeWith(
    otherMetadata: HandlerMetadata<COMPONENT, KEY> | HandlerOptionMetadata<COMPONENT, KEY>,
  ): HandlerMetadata<COMPONENT, KEY> {
    for (const key in otherMetadata.options) {
      if (otherMetadata.options.hasOwnProperty(key) && otherMetadata.options[key]) {
        const valueToMergeIn = otherMetadata.options[key];
        if (Array.isArray(valueToMergeIn) && Array.isArray(this.options[key])) {
          (this.options[key] as unknown[]).push(...valueToMergeIn);
        } else if (
          typeof valueToMergeIn === 'function' &&
          typeof this.options[key] === 'function'
        ) {
          // TODO: check if this is necessary: it is experimental
          const currentFunction = this.options[key] as (
            ...args: unknown[]
          ) => unknown | Promise<unknown>;
          this.options[key] = async function (...args: unknown[]) {
            const currentResult = await currentFunction.call(this, ...args);
            const newResult = await valueToMergeIn.call(this, ...args);
            return currentResult && newResult;
          };
        } else {
          this.options[key] = valueToMergeIn;
        }
      }
    }
    return this;
  }
}
