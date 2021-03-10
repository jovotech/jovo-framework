import { BaseComponent, ComponentConstructor } from '../BaseComponent';
import { ComponentMetadata } from './ComponentMetadata';
import { ConditionsOptions, HandlerMetadata, RoutesOptions } from './HandlerMetadata';

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

  addComponentMetadata<COMPONENT extends BaseComponent>(metadata: ComponentMetadata<COMPONENT>) {
    // TODO: determine what to do if a component like that already exists
    // for now, just skip (first only counts)
    if (this.getComponentMetadata(metadata.target)) {
      return;
    }
    this.componentMetadata.push(metadata);
  }

  getComponentMetadata<COMPONENT extends BaseComponent>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: ComponentConstructor<COMPONENT> | Function,
  ): ComponentMetadata<COMPONENT> | undefined {
    return this.componentMetadata.find((metadata) => metadata.target === target);
  }

  addHandlerMetadata<COMPONENT extends BaseComponent, KEY extends keyof COMPONENT>(
    metadata: HandlerMetadata<COMPONENT, KEY>,
  ) {
    // TODO: determine what to do if a handler like that already exists
    // for now, just skip (first only counts)
    if (this.getHandlerMetadata(metadata.target, metadata.propertyKey)) {
      return;
    }
    this.handlerMetadata.push(metadata as HandlerMetadata);
  }

  getHandlerMetadataOfComponent<COMPONENT extends BaseComponent>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: ComponentConstructor<COMPONENT> | Function,
  ): HandlerMetadata<COMPONENT, keyof COMPONENT>[] {
    return this.handlerMetadata.filter((metadata) => metadata.target === target);
  }

  getHandlerMetadata<COMPONENT extends BaseComponent, KEY extends keyof COMPONENT>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: ComponentConstructor<COMPONENT> | Function,
    propertyKey: KEY,
  ): HandlerMetadata<COMPONENT, KEY> | undefined {
    return this.handlerMetadata.find(
      (metadata) => metadata.target === target && metadata.propertyKey === propertyKey,
    ) as HandlerMetadata<COMPONENT, KEY> | undefined;
  }

  clearAll(): void {
    this.componentMetadata.length = 0;
    this.handlerMetadata.length = 0;
  }
}
