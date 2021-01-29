import { BaseComponent, ComponentConstructor } from '../../../BaseComponent';
import { ComponentMetadata } from './ComponentMetadata';
import { HandlerMetadata } from './HandlerMetadata';

// TODO: implement
export class MetadataStorage {
  private static instance: MetadataStorage;
  readonly componentMetadata: ComponentMetadata[];
  readonly handlerMetadata: HandlerMetadata[];

  private constructor() {
    this.componentMetadata = [];
    this.handlerMetadata = [];
  }

  static getInstance(): MetadataStorage {
    if (!MetadataStorage.instance) {
      MetadataStorage.instance = new MetadataStorage();
    }
    return MetadataStorage.instance;
  }

  addComponentMetadata<COMPONENT extends BaseComponent = BaseComponent>(
    metadata: ComponentMetadata<COMPONENT>,
  ) {
    // TODO: determine what to do if a component like that already exists
    // for now, just skip (first only counts)
    if (this.getComponentMetadata(metadata.target)) {
      return;
    }
    this.componentMetadata.push(metadata);
  }

  getComponentMetadata<COMPONENT extends BaseComponent = BaseComponent>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: ComponentConstructor<COMPONENT> | Function,
  ): ComponentMetadata<COMPONENT> | undefined {
    return this.componentMetadata.find((metadata) => metadata.target === target);
  }

  addHandlerMetadata<
    COMPONENT extends BaseComponent = BaseComponent,
    KEY extends keyof COMPONENT = keyof COMPONENT
  >(metadata: HandlerMetadata<COMPONENT, KEY>) {
    // TODO: determine what to do if a handler like that already exists
    // for now, just add it
    this.handlerMetadata.push(metadata as HandlerMetadata);
  }

  getHandlerMetadata<
    COMPONENT extends BaseComponent = BaseComponent,
    KEY extends keyof COMPONENT = keyof COMPONENT
  >(
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: ComponentConstructor<COMPONENT> | Function,
    propertyKey: KEY,
  ): HandlerMetadata<COMPONENT, KEY>[] {
    return this.handlerMetadata.filter(
      (metadata) => metadata.target === target && metadata.propertyKey === propertyKey,
    ) as HandlerMetadata<COMPONENT, KEY>[];
  }

  clearAll(): void {
    this.componentMetadata.length = 0;
    this.handlerMetadata.length = 0;
  }
}
