import {
  Global,
  Component,
  BaseComponent,
  InputType,
  App,
  Intents,
  Injectable,
  Jovo,
  ComponentOptions,
  UnknownObject,
  Output,
  BaseOutput,
  OutputTemplate,
  DeepPartial,
  OutputOptions,
  Inject,
  isSameProvide,
} from '../src';
import { ExamplePlatform, ExampleServer } from './utilities';

describe('dependency injection in components', () => {
  test('nested dependency injection', async () => {
    @Injectable()
    class ExampleService {
      constructor(readonly jovo: Jovo) {}

      getExample() {
        return `example_${this.jovo.$input.getIntentName()}`;
      }
    }

    @Injectable()
    class WrapperService {
      constructor(readonly exampleService: ExampleService) {}

      getExample() {
        return this.exampleService.getExample();
      }
    }

    @Global()
    @Component()
    class ComponentA extends BaseComponent {
      constructor(
        jovo: Jovo,
        options: ComponentOptions<UnknownObject> | undefined,
        readonly wrapperService: WrapperService,
      ) {
        super(jovo, options);
      }

      @Intents('IntentA')
      handleIntentA() {
        return this.$send(this.wrapperService.getExample());
      }
    }

    const app = new App({
      plugins: [new ExamplePlatform()],
      providers: [ExampleService, WrapperService],
      components: [ComponentA],
    });
    await app.initialize();

    const server = new ExampleServer({
      input: {
        type: InputType.Intent,
        intent: 'IntentA',
      },
    });
    await app.handle(server);
    expect(server.response.output).toEqual([
      {
        message: 'example_IntentA',
      },
    ]);
  });
});

describe('dependency injection in output classes', () => {
  test('output class with dependency injection', async () => {
    @Injectable()
    class ExampleService {
      constructor(readonly jovo: Jovo) {}

      getExample() {
        return `example_${this.jovo.$input.getIntentName()}`;
      }
    }

    @Output()
    class ExampleOutput extends BaseOutput {
      constructor(
        jovo: Jovo,
        options: DeepPartial<OutputOptions> | undefined,
        readonly exampleService: ExampleService,
      ) {
        super(jovo, options);
      }

      build(): OutputTemplate {
        return {
          message: this.exampleService.getExample(),
        };
      }
    }

    @Global()
    @Component()
    class ComponentA extends BaseComponent {
      constructor(jovo: Jovo, options: ComponentOptions<UnknownObject> | undefined) {
        super(jovo, options);
      }

      @Intents('IntentA')
      handleIntentA() {
        return this.$send(ExampleOutput);
      }
    }

    const app = new App({
      plugins: [new ExamplePlatform()],
      providers: [ExampleService],
      components: [ComponentA],
    });
    await app.initialize();

    const server = new ExampleServer({
      input: {
        type: InputType.Intent,
        intent: 'IntentA',
      },
    });
    await app.handle(server);
    expect(server.response.output).toEqual([
      {
        message: 'example_IntentA',
      },
    ]);
  });
});

describe('dependency injection variations', () => {
  test('dependency tokens', async () => {
    class TokenA {}
    abstract class TokenB {}

    const EXAMPLE_TOKEN_1 = Symbol('example_token_1');
    const EXAMPLE_TOKEN_2 = 'example_token_2';
    const EXAMPLE_TOKEN_3 = Jovo;
    const EXAMPLE_TOKEN_4 = TokenA;
    const EXAMPLE_TOKEN_5 = TokenB;

    @Global()
    @Component()
    class InjectTokenVariationsComponent extends BaseComponent {
      constructor(
        jovo: Jovo,
        options: ComponentOptions<UnknownObject> | undefined,
        @Inject(EXAMPLE_TOKEN_1) readonly example1: string,
        @Inject(EXAMPLE_TOKEN_2) readonly example2: string,
        @Inject(EXAMPLE_TOKEN_3) readonly example3: string,
        @Inject(EXAMPLE_TOKEN_4) readonly example4: string,
        @Inject(EXAMPLE_TOKEN_5) readonly example5: string,
      ) {
        super(jovo, options);
      }

      @Intents('IntentA')
      handleIntentA() {
        return this.$send(
          `${this.example1}_${this.example2}_${this.example3}_${this.example4}_${this.example5}`,
        );
      }
    }

    const app = new App({
      plugins: [new ExamplePlatform()],
      providers: [
        {
          provide: EXAMPLE_TOKEN_1,
          useValue: 'example1',
        },
        {
          provide: EXAMPLE_TOKEN_2,
          useValue: 'example2',
        },
        {
          provide: EXAMPLE_TOKEN_3,
          useValue: 'example3',
        },
        {
          provide: EXAMPLE_TOKEN_4,
          useValue: 'example4',
        },
        {
          provide: EXAMPLE_TOKEN_5,
          useValue: 'example5',
        },
      ],
      components: [InjectTokenVariationsComponent],
    });
    await app.initialize();

    const server = new ExampleServer({
      input: {
        type: InputType.Intent,
        intent: 'IntentA',
      },
    });
    await app.handle(server);
    expect(server.response.output).toEqual([
      {
        message: 'example1_example2_example3_example4_example5',
      },
    ]);
  });

  test('provider variations', async () => {
    const EXAMPLE_TOKEN_1 = Symbol('example_token_1');
    const EXAMPLE_TOKEN_2 = Symbol('example_token_2');
    const EXAMPLE_TOKEN_3 = Symbol('example_token_3');

    @Global()
    @Component()
    class ComponentA extends BaseComponent {
      constructor(
        jovo: Jovo,
        options: ComponentOptions<UnknownObject> | undefined,
        @Inject(EXAMPLE_TOKEN_1) readonly example1: string,
        @Inject(EXAMPLE_TOKEN_2) readonly example2: string,
        @Inject(EXAMPLE_TOKEN_3) readonly example3: string,
      ) {
        super(jovo, options);
      }

      @Intents('IntentA')
      handleIntentA() {
        return this.$send(`${this.example1}_${this.example2}_${this.example3}`);
      }
    }

    const app = new App({
      plugins: [new ExamplePlatform()],
      providers: [
        {
          provide: EXAMPLE_TOKEN_1,
          useValue: 'example1',
        },
        {
          provide: EXAMPLE_TOKEN_2,
          useFactory: () => 'example2',
        },
        {
          provide: EXAMPLE_TOKEN_3,
          useClass: class Example3 extends String {
            constructor() {
              super('example3');
            }
          },
        },
      ],
      components: [ComponentA],
    });
    await app.initialize();

    const server = new ExampleServer({
      input: {
        type: InputType.Intent,
        intent: 'IntentA',
      },
    });
    await app.handle(server);
    expect(server.response.output).toEqual([
      {
        message: 'example1_example2_example3',
      },
    ]);
  });
});

describe('dependency overrides', () => {
  test('override provider with app.configure', () => {
    @Injectable()
    class ExampleService {
      getExample() {
        return 'example';
      }
    }

    @Injectable()
    class UnrelatedService {}

    class OverrideService {
      getExample() {
        return 'override';
      }
    }

    const app = new App({
      plugins: [new ExamplePlatform()],
      providers: [ExampleService, UnrelatedService],
      components: [],
    });

    app.configure({
      providers: [
        {
          provide: ExampleService,
          useClass: OverrideService,
        },
      ],
    });

    expect(app.providers.length).toEqual(3);
    expect(app.providers.slice(0, 2)).toEqual([
      {
        provide: ExampleService,
        useClass: OverrideService,
      },
      UnrelatedService,
    ]);
    expect(isSameProvide(app.providers[2], { provide: Jovo, useFactory: (jovo) => jovo })).toEqual(
      true,
    );
  });
});
