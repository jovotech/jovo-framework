import {
  BaseComponent,
  ComponentConfig,
  ComponentConstructor,
  ComponentDeclaration,
} from '../BaseComponent';
import { AnyObject, DeepPartial, JovoConditionFunction, UnknownObject } from '../index';
import { ClassDecoratorMetadata } from './ClassDecoratorMetadata';
import { ComponentOptionMetadata } from './ComponentOptionMetadata';

export interface ComponentOptions<COMPONENT extends BaseComponent> extends UnknownObject {
  name?: string;
  global?: boolean;
  config?: DeepPartial<ComponentConfig<COMPONENT>>;
  components?: Array<ComponentConstructor | ComponentDeclaration>;
  models?: AnyObject;

  isAvailable?: JovoConditionFunction;
  platforms?: string[];
}

export class ComponentMetadata<
  COMPONENT extends BaseComponent = BaseComponent,
> extends ClassDecoratorMetadata<COMPONENT> {
  constructor(
    // eslint-disable-next-line @typescript-eslint/ban-types
    readonly target: ComponentConstructor<COMPONENT> | Function,
    readonly options: ComponentOptions<COMPONENT> = {},
  ) {
    super(target);
  }

  get isGlobal(): boolean {
    return !!this.options.global;
  }

  mergeWith(
    otherMetadata: ComponentMetadata<COMPONENT> | ComponentOptionMetadata<COMPONENT>,
  ): ComponentMetadata<COMPONENT> {
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
