import { App, ComponentTreeNode } from '../src';
import { EmptyComponent } from './utilities';

describe('constructor', () => {
  test('config with components passed: use components', () => {
    const app = new App({
      components: [EmptyComponent],
    });
    expect(app.componentTree.getNodeAt(['EmptyComponent'])).toBeInstanceOf(ComponentTreeNode);
  });
});
