import _merge from 'lodash.merge';
import { ComponentConstructor, ComponentDeclaration } from './BaseComponent';
import { DuplicateChildComponentsError } from './errors/DuplicateChildComponentsError';
import { ComponentMetadata } from './metadata/ComponentMetadata';
import { MetadataStorage } from './metadata/MetadataStorage';

export interface Tree<NODE extends { children?: Tree<NODE> }> {
  [key: string]: NODE;
}

export interface ComponentTreeNodeOptions {
  metadata: ComponentMetadata;
  path: string[];
  parent?: ComponentTreeNode;
  children?: Array<ComponentConstructor | ComponentDeclaration>;
}

export class ComponentTreeNode {
  readonly metadata: ComponentMetadata;
  readonly parent?: ComponentTreeNode;
  readonly children?: Tree<ComponentTreeNode>;
  readonly path: string[];

  constructor({ path, metadata, parent, children }: ComponentTreeNodeOptions) {
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

  toJSON() {
    return { ...this, parent: this.parent ? this.parent.name : undefined };
  }
}

export class ComponentTree {
  static createComponentToNodeMapper(parent?: ComponentTreeNode) {
    return (component: ComponentConstructor | ComponentDeclaration): ComponentTreeNode => {
      const componentConstructor =
        typeof component === 'function' ? component : component.component;
      const componentMetadata =
        MetadataStorage.getInstance().getComponentMetadata(componentConstructor);
      const mergedComponentOptions = _merge(
        {},
        componentMetadata?.options || {},
        typeof component === 'function' ? {} : component.options || {},
      );
      const componentName = componentMetadata?.options?.name || componentConstructor.name;
      return new ComponentTreeNode({
        metadata: new ComponentMetadata(componentConstructor, mergedComponentOptions),
        parent,
        children: mergedComponentOptions.components,
        path: parent?.path ? [...parent.path, componentName] : [componentName],
      });
    };
  }

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

  readonly tree: Tree<ComponentTreeNode>;

  constructor(...components: Array<ComponentConstructor | ComponentDeclaration>) {
    this.tree = this.buildTreeForComponents(...components);
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
