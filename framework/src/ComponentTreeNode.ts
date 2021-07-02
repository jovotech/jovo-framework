import { BaseComponent, ComponentConstructor, ComponentDeclaration } from './BaseComponent';
import { ComponentTree, Tree } from './ComponentTree';
import { InternalIntent } from './enums';
import { HandlerNotFoundError } from './errors/HandlerNotFoundError';
import { PickWhere } from './index';
import { Jovo } from './Jovo';
import { ComponentMetadata } from './metadata/ComponentMetadata';

export interface ComponentTreeNodeOptions<COMPONENT extends BaseComponent = BaseComponent> {
  metadata: ComponentMetadata<COMPONENT>;
  path: string[];
  parent?: ComponentTreeNode;
  children?: Array<ComponentConstructor | ComponentDeclaration>;
}

export interface ExecuteHandlerOptions<
  COMPONENT extends BaseComponent,
  // eslint-disable-next-line @typescript-eslint/ban-types
  HANDLER extends Exclude<keyof PickWhere<COMPONENT, Function>, keyof BaseComponent>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ARGS extends unknown[] = any[],
> {
  jovo: Jovo;
  handler?: HANDLER | string;
  callArgs?: ARGS;
}

export class ComponentTreeNode<COMPONENT extends BaseComponent = BaseComponent> {
  readonly metadata: ComponentMetadata<COMPONENT>;
  readonly parent?: ComponentTreeNode;
  readonly children?: Tree<ComponentTreeNode>;
  readonly path: string[];

  constructor({ path, metadata, parent, children }: ComponentTreeNodeOptions<COMPONENT>) {
    this.path = path.slice();
    this.metadata = metadata;
    if (parent) {
      this.parent = parent;
    }
    if (children?.length) {
      this.children = children.reduce(ComponentTree.createComponentsToTreeReducer(this), {});
    }
  }

  get isRootNode(): boolean {
    return !this.parent;
  }

  get name(): string {
    return this.metadata.options?.name || this.metadata.target.name;
  }

  async executeHandler<
    // eslint-disable-next-line @typescript-eslint/ban-types
    HANDLER extends Exclude<keyof PickWhere<COMPONENT, Function>, keyof BaseComponent>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ARGS extends unknown[] = any[],
  >({
    jovo,
    handler = InternalIntent.Start,
    callArgs,
  }: ExecuteHandlerOptions<COMPONENT, HANDLER, ARGS>): Promise<void> {
    const componentInstance = new (this.metadata.target as ComponentConstructor<COMPONENT>)(
      jovo,
      this.metadata.options?.config,
    );
    if (!componentInstance[handler as keyof COMPONENT]) {
      throw new HandlerNotFoundError(componentInstance.constructor.name, handler.toString());
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (componentInstance as any)[handler](...(callArgs || []));
  }

  toJSON(): Omit<ComponentTreeNode<COMPONENT>, 'parent'> & { parent?: string } {
    return { ...this, parent: this.parent ? this.parent.name : undefined };
  }
}
