import {
  BaseComponent,
  ComponentConstructor,
  ComponentDeclaration,
  RegisteredComponents,
} from '../BaseComponent';
import { DeepPartial, JovoConditionFunction } from '../index';

export interface ComponentOptions<COMPONENT extends BaseComponent> {
  name?: string;
  config?: DeepPartial<COMPONENT['config']>;
  components?: Array<ComponentConstructor | ComponentDeclaration>;
  models?: Record<string, any>;

  isAvailable?: JovoConditionFunction;
  platforms?: string[];
}

export class ComponentMetadata<COMPONENT extends BaseComponent = BaseComponent> {
  readonly options?: ComponentOptions<COMPONENT>;

  constructor(
    // eslint-disable-next-line @typescript-eslint/ban-types
    readonly target: ComponentConstructor<COMPONENT> | Function,
    options?: ComponentOptions<COMPONENT>,
  ) {
    if (options) {
      this.options = options;
    }
  }
}

export class RegisteredComponentMetadata<
  COMPONENT extends BaseComponent = BaseComponent
> extends ComponentMetadata<COMPONENT> {
  components?: RegisteredComponents;
  instance?: COMPONENT;
}
