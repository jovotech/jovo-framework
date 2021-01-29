import { BaseComponent, Component } from 'jovo-core';
import { MenuComponent } from './MenuComponent';
import { MenuComponent as MenuComponent2 } from './MenuComponent2';

@Component({
  components: [MenuComponent, { component: MenuComponent2, options: { name: 'MenuComponent2' } }],
})
export class StandardComponent extends BaseComponent {}
