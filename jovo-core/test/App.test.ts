import { App } from '../src';
import { ExampleComponent } from './utilities';

const app = new App();

app.useComponents(ExampleComponent);

(async () => {
  await app.initialize();
  await app.handle({});
})();

test('placeholder', () => {
  expect(true).toBe(true);
});
