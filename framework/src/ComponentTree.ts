import _get from 'lodash.get';
import _merge from 'lodash.merge';
import { ComponentConstructor, ComponentDeclaration } from './BaseComponent';
import { ComponentTreeNode } from './ComponentTreeNode';
import { ComponentNotFoundError } from './errors/ComponentNotFoundError';
import { DuplicateChildComponentsError } from './errors/DuplicateChildComponentsError';
import { InvalidComponentTreeBuiltError } from './errors/InvalidComponentTreeBuiltError';
import { ComponentMetadata } from './metadata/ComponentMetadata';
import { MetadataStorage } from './metadata/MetadataStorage';

export interface Tree<NODE extends { children?: Tree<NODE> }> {
  [key: string]: NODE;
}

/**
 * @example Structure of ComponentTree
 * {
 * "tree": {
 *   "GlobalComponent": {
 *     "path": [
 *       "GlobalComponent"
 *     ],
 *     "metadata": {
 *       "options": {
 *         "global": true
 *       }
 *     }
 *   },
 *   "RootComponent": {
 *     "path": [
 *       "RootComponent"
 *     ],
 *     "metadata": {
 *       "options": {
 *         "components": [
 *           "NestedComponent"
 *         ]
 *       }
 *     },
 *     "children": {
 *       "NestedComponent": {
 *         "path": [
 *           "RootComponent",
 *           "NestedComponent"
 *         ],
 *         "metadata": {
 *           "options": {}
 *         },
 *         "parent": "RootComponent"
 *       }
 *     }
 *   }
 * }
 *}
 */
export class ComponentTree {
  // returns a map-callback that will create a ComponentTreeNode for the given component (constructor or declaration)
  static createComponentToNodeMapper(componentTree: ComponentTree, parent?: ComponentTreeNode) {
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
      return new ComponentTreeNode(componentTree, {
        metadata: new ComponentMetadata(componentConstructor, mergedComponentOptions),
        parent,
        children: mergedComponentOptions.components,
        path: parent?.path ? [...parent.path, componentName] : [componentName],
      });
    };
  }

  // returns a reduce-callback that will create a Tree from the components it's called on
  static createComponentsToTreeReducer(componentTree: ComponentTree, parent?: ComponentTreeNode) {
    return (
      tree: Tree<ComponentTreeNode>,
      component: ComponentConstructor | ComponentDeclaration,
    ): Tree<ComponentTreeNode> => {
      const node = ComponentTree.createComponentToNodeMapper(componentTree, parent)(component);
      if (!tree[node.name]) {
        tree[node.name] = node;
        // throw new DuplicateChildComponentsError(node.name, parent?.name || 'Root');
      } else {
        componentTree.initialBuildErrors.push(
          new DuplicateChildComponentsError(node.name, parent?.name || 'Root'),
        );
        // console.warn(`Duplicate child component ${node.name} of ${parent?.name || 'Root'}`);
      }
      return tree;
    };
  }

  readonly tree: Tree<ComponentTreeNode>;
  readonly initialBuildErrors: Array<DuplicateChildComponentsError | Error> = [];

  constructor(...components: Array<ComponentConstructor | ComponentDeclaration>) {
    this.tree = this.buildTreeForComponents(...components);
  }

  [Symbol.iterator](): Iterator<ComponentTreeNode> {
    let index = -1;
    const nodes: ComponentTreeNode[] = [];
    this.iterateNodes(Object.values(this.tree), (node) => {
      nodes.push(node);
    });
    return {
      next: () => ({ value: nodes[++index], done: !(index in nodes) }),
    };
  }

  async initialize(): Promise<void> {
    if (this.initialBuildErrors.length) {
      throw new InvalidComponentTreeBuiltError(this.initialBuildErrors);
    }
  }

  add(...components: Array<ComponentConstructor | ComponentDeclaration>): void {
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

  /**
   * Find a node that matches the componentName relative to the node at relativeTo
   */
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

  forEach(callback: (node: ComponentTreeNode) => void): void {
    this.iterateNodes(Object.values(this.tree), callback);
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
    return components.reduce(ComponentTree.createComponentsToTreeReducer(this), {});
  }
}
