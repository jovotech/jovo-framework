export class App {
  async bootstrap() {
    //
    await 1;
  }

  handle(request: any): void {
    console.log(request);
  }

  config(config: any): this {
    return this;
  }
}
