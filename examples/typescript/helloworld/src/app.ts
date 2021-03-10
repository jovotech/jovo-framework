import { App } from "jovo-framework";

const app = new App();

function readonly(target: any) {
  target.descriptor.writable = false;
  return target;
}

@Handler()
class MyHandler {
  @OnRequest()
  onRequest() {
    this.$data.foo = 'bar';
  }

  @Launch()
  launchApp() {
    this.setState('NameState');

    return {
      message: 'Hello World! Whats your name?',
    };
  }

  @State('NameState')
  @Intent(['MyNameIsIntent'])
  nameIntent(@Entity('name') name: string) {
    this.tell(`Hey ${name}!`);
  }
}

class Root {
  constructor() {}

  onLaunch() {
    return delegate(Onboarding.start, {});
  }

  allDataCollected() {}
}

class Onboarding {
  start() {}
}

app.setHandlers(Root, Onboarding);

export { app };
