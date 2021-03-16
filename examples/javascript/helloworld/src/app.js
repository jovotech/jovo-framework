import { App } from "@jovotech/framework";

function readonly(target) {
  target.descriptor.writable = false;
  return target;
}

const app = new App();
class Foo {
  @readonly
  getBar() {
    return this.bar;
  }
}
export { app };
