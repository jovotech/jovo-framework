import _cloneDeep from 'lodash.clonedeep';
import { BaseComponent, ComponentConstructor } from '../BaseComponent';
import { BaseOutput, OutputConstructor } from '../BaseOutput';
import { ComponentMetadata } from './ComponentMetadata';
import { ComponentOptionMetadata } from './ComponentOptionMetadata';
import { HandlerMetadata } from './HandlerMetadata';
import { HandlerOptionMetadata } from './HandlerOptionMetadata';
import { MethodDecoratorMetadata } from './MethodDecoratorMetadata';
import { OutputMetadata } from './OutputMetadata';
import { InjectableMetadata } from './InjectableMetadata';
import { Constructor } from '@jovotech/common';
import { InjectMetadata } from './InjectMetadata';

export class MetadataStorage {
  private static instance: MetadataStorage;
  readonly componentMetadata: ComponentMetadata[];
  readonly componentOptionMetadata: ComponentOptionMetadata[];
  readonly handlerMetadata: HandlerMetadata[];
  readonly handlerOptionMetadata: HandlerOptionMetadata[];
  readonly outputMetadata: OutputMetadata[];
  readonly injectableMetadata: InjectableMetadata[];
  readonly injectMetadata: InjectMetadata[];

  private constructor() {
    this.componentMetadata = [];
    this.componentOptionMetadata = [];
    this.handlerMetadata = [];
    this.handlerOptionMetadata = [];
    this.outputMetadata = [];
    this.injectableMetadata = [];
    this.injectMetadata = [];
  }

  static getInstance(): MetadataStorage {
    if (!MetadataStorage.instance) {
      MetadataStorage.instance = new MetadataStorage();
    }
    return MetadataStorage.instance;
  }

  addComponentMetadata<COMPONENT extends BaseComponent>(
    metadata: ComponentMetadata<COMPONENT>,
  ): void {
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
    return this.componentMetadata.find((metadata) => metadata.target === target) as
      | ComponentMetadata<COMPONENT>
      | undefined;
  }

  getMergedComponentMetadata<COMPONENT extends BaseComponent>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: ComponentConstructor<COMPONENT> | Function,
  ): ComponentMetadata<COMPONENT> | undefined {
    const componentMetadata = this.getComponentMetadata(target);
    const componentOptionMetadata = this.getComponentOptionMetadata(target);
    if (!componentMetadata && !componentOptionMetadata.length) {
      return;
    }
    const mergedComponentMetadata = componentMetadata
      ? _cloneDeep(componentMetadata)
      : new ComponentMetadata(target);

    componentOptionMetadata.forEach((optionMetadata) =>
      mergedComponentMetadata.mergeWith(optionMetadata),
    );
    return mergedComponentMetadata;
  }

  addComponentOptionMetadata<COMPONENT extends BaseComponent>(
    metadata: ComponentOptionMetadata<COMPONENT>,
  ): void {
    this.componentOptionMetadata.push(metadata);
  }

  getComponentOptionMetadata<COMPONENT extends BaseComponent>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: ComponentConstructor<COMPONENT> | Function,
  ): ComponentOptionMetadata<COMPONENT>[] {
    return this.componentOptionMetadata.filter(
      (metadata) => metadata.target === target,
    ) as ComponentOptionMetadata<COMPONENT>[];
  }

  addOutputMetadata<OUTPUT extends BaseOutput>(
    target: OutputConstructor<OUTPUT>,
    name: string,
  ): void {
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
  ): void {
    this.handlerMetadata.push(metadata as HandlerMetadata);
  }

  getHandlerMetadataOfComponent<COMPONENT extends BaseComponent>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: ComponentConstructor<COMPONENT> | Function,
  ): HandlerMetadata<COMPONENT, keyof COMPONENT>[] {
    return this.handlerMetadata.filter((metadata) => metadata.target === target);
  }

  getMergedHandlerMetadataOfComponent<COMPONENT extends BaseComponent>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: ComponentConstructor<COMPONENT> | Function,
  ): HandlerMetadata<COMPONENT, keyof COMPONENT>[] {
    const mergedComponentMetadata = this.getMergedComponentMetadata(target);
    const componentHandlerMetadata = this.getHandlerMetadataOfComponent(target);
    const mergedMetadata = componentHandlerMetadata.map((handlerMetadata) => {
      const mergedHandlerMetadata = _cloneDeep(handlerMetadata);
      const relatedHandlerOptionMetadata = this.handlerOptionMetadata.filter((optionMetadata) =>
        optionMetadata.hasSameTargetAs(mergedHandlerMetadata as MethodDecoratorMetadata),
      );
      relatedHandlerOptionMetadata.forEach((optionMetadata) =>
        mergedHandlerMetadata.mergeWith(optionMetadata),
      );
      if (mergedComponentMetadata?.isGlobal) {
        mergedHandlerMetadata.options.global = true;
      }
      return mergedHandlerMetadata;
    });

    const handlerOptionMetadataWithoutHandler = this.handlerOptionMetadata.filter(
      (optionMetadata) =>
        optionMetadata.target === target &&
        !componentHandlerMetadata.some((handlerMetadata) =>
          handlerMetadata.hasSameTargetAs(optionMetadata),
        ),
    );
    handlerOptionMetadataWithoutHandler.forEach((optionMetadata) => {
      const relatedHandlerMetadata = mergedMetadata.find((handlerMetadata) =>
        handlerMetadata.hasSameTargetAs(optionMetadata),
      );
      if (!relatedHandlerMetadata) {
        mergedMetadata.push(
          new HandlerMetadata<COMPONENT, keyof COMPONENT>(
            optionMetadata.target,
            optionMetadata.propertyKey,
            {
              ...optionMetadata.options,
              global: mergedComponentMetadata?.isGlobal || optionMetadata.options.global,
            },
          ),
        );
      } else {
        relatedHandlerMetadata.mergeWith(optionMetadata);
      }
    });

    const prototype = Object.getPrototypeOf(target);
    // Object.getPrototypeOf of the topmost class in the superclass chain is {} (empty object)
    // and Object.getPrototypeOf({}) is Object.prototype.
    if (prototype && Object.getPrototypeOf(prototype) !== Object.prototype) {
      const parentMergedMetadata = this.getMergedHandlerMetadataOfComponent(prototype);
      return this.mergeHandlerMetadataWithParent(mergedMetadata, parentMergedMetadata);
    }

    return mergedMetadata;
  }

  /**
   * Merges the handler metadata of a component with the handler metadata of its superclass.
   * When a child class declares a handler with the same name as a handler of its superclass,
   * the child class handler overrides the superclass handler and replaces all of its annotations.
   *
   * @param handlerMetadata
   * @param parentMetadata
   * @private
   */
  private mergeHandlerMetadataWithParent<COMPONENT extends BaseComponent>(
    handlerMetadata: HandlerMetadata<COMPONENT, keyof COMPONENT>[],
    parentMetadata: HandlerMetadata<COMPONENT, keyof COMPONENT>[],
  ): HandlerMetadata<COMPONENT, keyof COMPONENT>[] {
    const mergedMetadata = [...handlerMetadata];
    for (const parentHandler of parentMetadata) {
      const isOverride =
        handlerMetadata.findIndex((meta) => {
          if (meta.propertyKey !== parentHandler.propertyKey) {
            return false;
          }
          return (
            meta.target === parentHandler.target ||
            Object.getPrototypeOf(meta.target) === parentHandler.target
          );
        }) >= 0;
      if (!isOverride) {
        mergedMetadata.push(parentHandler);
      }
    }
    return mergedMetadata;
  }

  addHandlerOptionMetadata<COMPONENT extends BaseComponent, KEY extends keyof COMPONENT>(
    metadata: HandlerOptionMetadata<COMPONENT, KEY>,
  ): void {
    this.handlerOptionMetadata.push(metadata as HandlerOptionMetadata);
  }

  getHandlerOptionMetadataOfComponent<COMPONENT extends BaseComponent>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: ComponentConstructor<COMPONENT> | Function,
  ): HandlerOptionMetadata<COMPONENT, keyof COMPONENT>[] {
    return this.handlerOptionMetadata.filter((metadata) => metadata.target === target);
  }

  addInjectableMetadata<PROVIDER>(metadata: InjectableMetadata<PROVIDER>): void {
    if (this.getInjectableMetadata(metadata.target)) {
      // for now, just skip (first only counts)
      return;
    }
    this.injectableMetadata.push(metadata as InjectableMetadata);
  }

  getInjectableMetadata<PROVIDER>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: Constructor<PROVIDER> | Function,
  ): InjectableMetadata<PROVIDER> | undefined {
    return this.injectableMetadata.find(
      (metadata) => metadata.target === target,
    ) as InjectableMetadata<PROVIDER>;
  }

  addInjectMetadata<PROVIDER>(metadata: InjectMetadata<PROVIDER>): void {
    if (this.getInjectMetadataAtIndex(metadata.target, metadata.index)) {
      // for now, just skip (first only counts)
      return;
    }
    this.injectMetadata.push(metadata as InjectMetadata);
  }

  getMergedInjectMetadata<PROVIDER>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: Constructor<PROVIDER> | Function,
  ): InjectMetadata<PROVIDER>[] {
    return this.injectMetadata.filter((metadata) => metadata.target === target);
  }

  getInjectMetadataAtIndex<PROVIDER>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: Constructor<PROVIDER> | Function,
    index: number,
  ): InjectMetadata<PROVIDER> | undefined {
    return this.injectMetadata.find(
      (metadata) => metadata.target === target && metadata.index === index,
    );
  }

  clearAll(): void {
    this.componentMetadata.length = 0;
    this.handlerMetadata.length = 0;
    this.handlerOptionMetadata.length = 0;
    this.outputMetadata.length = 0;
    this.injectableMetadata.length = 0;
    this.injectMetadata.length = 0;
  }
}
