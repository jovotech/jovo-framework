import _get from 'lodash.get';
import _merge from 'lodash.merge';
import { ComponentConstructor, ComponentDeclaration } from './BaseComponent';
import { ComponentTreeNode } from './ComponentTreeNode';
import { ComponentNotFoundError } from './errors/ComponentNotFoundError';
import { DuplicateChildComponentsError } from './errors/DuplicateChildComponentsError';
import { ComponentMetadata } from './metadata/ComponentMetadata';
import { MetadataStorage } from './metadata/MetadataStorage';

export interface Tree<NODE extends { children?: Tree<NODE> }> {
  [key: string]: NODE;
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
