import { App } from 'jovo-framework';

function readonly(target) {
  target.descriptor.writable = false;
  return target;
}

console.log('hi');
const app = new App();
class Foo {
  @readonly
  getBar() {
    return this.bar;
  }
}
export { app };
