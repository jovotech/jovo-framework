import { BaseComponent, ComponentConstructor } from '../BaseComponent';
import { BaseOutput, OutputConstructor } from '../BaseOutput';
import { ComponentMetadata } from './ComponentMetadata';
import { HandlerMetadata } from './HandlerMetadata';
import { OutputMetadata } from './OutputMetadata';

// TODO: implement
export class MetadataStorage {
  private static instance: MetadataStorage;
  // TODO: determine whether any is required/helpful here
  readonly componentMetadata: ComponentMetadata[];
  readonly handlerMetadata: HandlerMetadata[];
  readonly outputMetadata: OutputMetadata[];

  private constructor() {
    this.componentMetadata = [];
    this.handlerMetadata = [];
    this.outputMetadata = [];
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

  addOutputMetadata<OUTPUT extends BaseOutput>(target: OutputConstructor<OUTPUT>, name: string) {
    const existingMetadata = this.getOutputMetadataByName(name);

    if (existingMetadata) {
      // make sure the name of an Output is unique
      const similarExistingMetadata = this.outputMetadata.filter((metadata) =>
        metadata.name.startsWith(name),
      );
      const getEndingNumberRegex = /(\d+)$/;
      let highestNumber = -1;
      similarExistingMetadata.forEach((metadata) => {
        const endingNumberMatch = getEndingNumberRegex.exec(metadata.name);
        const endingNumber = +(endingNumberMatch?.[1] || -1);
        if (endingNumber > highestNumber) {
          highestNumber = endingNumber;
        }
      });
      highestNumber++;

      if (getEndingNumberRegex.test(name)) {
        name = name.replace(getEndingNumberRegex, highestNumber.toString());
      } else {
        name += highestNumber;
      }
    }

    this.outputMetadata.push(new OutputMetadata(target, name));
  }

  getOutputMetadata<OUTPUT extends BaseOutput>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: OutputConstructor<OUTPUT> | Function,
  ): OutputMetadata<OUTPUT> | undefined {
    return this.outputMetadata.find((metadata) => metadata.target === target);
  }

  getOutputMetadataByName<OUTPUT extends BaseOutput>(
    name: string,
  ): OutputMetadata<OUTPUT> | undefined {
    return this.outputMetadata.find((metadata) => metadata.name === name);
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
    this.outputMetadata.length = 0;
  }
}
