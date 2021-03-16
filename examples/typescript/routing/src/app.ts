import { App } from '@jovotech/core';
import { MenuCategoriesComponent } from './components/MenuCategoriesComponent';
import { MenuComponent } from './components/MenuComponent';
import { StandardComponent } from './components/StandardComponent';

const app = new App();

app.useComponents(StandardComponent, MenuComponent, MenuCategoriesComponent);
