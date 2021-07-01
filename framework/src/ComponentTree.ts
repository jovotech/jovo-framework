import _get from 'lodash.get';
import _merge from 'lodash.merge';
import { BaseComponent, ComponentConstructor, ComponentDeclaration } from './BaseComponent';
import { DuplicateChildComponentsError } from './errors/DuplicateChildComponentsError';
import {
  ComponentNotFoundError,
  HandlerNotFoundError,
  InternalIntent,
  Jovo,
  PickWhere,
} from './index';
import { ComponentMetadata } from './metadata/ComponentMetadata';
import { MetadataStorage } from './metadata/MetadataStorage';

export interface Tree<NODE extends { children?: Tree<NODE> }> {
  [key: string]: NODE;
}

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
  ARGS extends any[] = any[],
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
    ARGS extends any[] = any[],
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

  toJSON() {
    return { ...this, parent: this.parent ? this.parent.name : undefined };
  }
}

export class ComponentTree {
  // returns a map-callback that will create a ComponentTreeNode for the given component (constructor or declaration)
  static createComponentToNodeMapper(parent?: ComponentTreeNode) {
    return (component: ComponentConstructor | ComponentDeclaration): ComponentTreeNode => {
      const componentConstructor =
        typeof component === 'function' ? component : component.component;
      // get the metadata of the component
      const componentMetadata =
        MetadataStorage.getInstance().getMergedComponentMetadata(componentConstructor);
      // merge the options of the related metadata with the options of the given options (only set when passing a declaration)
      const mergedComponentOptions = _merge(
        {},
        componentMetadata?.options || {},
        typeof component === 'function' ? {} : component.options || {},
      );
      const componentName = componentMetadata?.options?.name || componentConstructor.name;
      // return a new node with metadata, that is constructed from the constructor and the merged component options, as well as additional data
      return new ComponentTreeNode({
        metadata: new ComponentMetadata(componentConstructor, mergedComponentOptions),
        parent,
        children: mergedComponentOptions.components,
        path: parent?.path ? [...parent.path, componentName] : [componentName],
      });
    };
  }

  // returns a reduce-callback that will create a Tree from the components it's called on
  static createComponentsToTreeReducer(parent?: ComponentTreeNode) {
    return (
      tree: Tree<ComponentTreeNode>,
      component: ComponentConstructor | ComponentDeclaration,
    ): Tree<ComponentTreeNode> => {
      const node = ComponentTree.createComponentToNodeMapper(parent)(component);
      if (tree[node.name]) {
        throw new DuplicateChildComponentsError(node.name, parent?.name || 'Root');
      }
      tree[node.name] = node;
      return tree;
    };
  }

  readonly tree: Tree<ComponentTreeNode>;

  constructor(...components: Array<ComponentConstructor | ComponentDeclaration>) {
    this.tree = this.buildTreeForComponents(...components);
  }

  [Symbol.iterator]() {
    let index = -1;
    const nodes: ComponentTreeNode[] = [];
    this.iterateNodes(Object.values(this.tree), (node) => {
      nodes.push(node);
    });
    return {
      next: () => ({ value: nodes[++index], done: !(index in nodes) }),
    };
  }

  add(...components: Array<ComponentConstructor | ComponentDeclaration>) {
    const tree = this.buildTreeForComponents(...components);
    for (const key in tree) {
      if (tree.hasOwnProperty(key)) {
        if (this.tree[key]) {
          throw new DuplicateChildComponentsError(key, 'Root');
        }
        this.tree[key] = tree[key];
      }
    }
  }

  getNodeAt(path: string[]): ComponentTreeNode | undefined {
    return _get(this.tree, path.join('.children.'));
  }

  getNodeAtOrFail(path: string[]): ComponentTreeNode {
    const node = this.getNodeAt(path);
    if (!node) {
      throw new ComponentNotFoundError(path);
    }
    return node;
  }

  getNodeRelativeTo(
    componentName: string,
    relativeTo: string[] = [],
  ): ComponentTreeNode | undefined {
    const currentComponentNode = this.getNodeAt(relativeTo);
    const rootComponentNode = this.tree[componentName];
    const childComponentNode = currentComponentNode?.children?.[componentName];
    return childComponentNode || rootComponentNode;
  }

  getNodeRelativeToOrFail(componentName: string, relativeTo: string[] = []): ComponentTreeNode {
    const componentNode = this.getNodeRelativeTo(componentName, relativeTo);
    if (!componentNode) {
      throw new ComponentNotFoundError([...relativeTo, componentName]);
    }
    return componentNode;
  }

  forEach(callback: (node: ComponentTreeNode) => void) {
    return this.iterateNodes(Object.values(this.tree), callback);
  }

  private iterateNodes(nodes: ComponentTreeNode[], callback: (node: ComponentTreeNode) => void) {
    nodes.forEach((node) => {
      callback(node);
      const childNodes = Object.values(node.children || {});
      if (childNodes.length) {
        this.iterateNodes(childNodes, callback);
      }
    });
  }

  private buildTreeForComponents(
    ...components: Array<ComponentConstructor | ComponentDeclaration>
  ): Tree<ComponentTreeNode> {
    return components.reduce(ComponentTree.createComponentsToTreeReducer(), {});
  }
}
