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

  getComponentMetadata<COMPONENT extends BaseComponent = BaseComponent>(
    target: ComponentConstructor<COMPONENT>,
  ): ComponentMetadata<COMPONENT> | undefined {
    return this.componentMetadata.find((metadata) => metadata.target === target);
  }

  clearAll(): void {
    this.componentMetadata.length = 0;
    this.handlerMetadata.length = 0;
  }
}
