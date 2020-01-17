import { ComponentOptions, JovoWebClient } from '..';

/**
 * O = ComponentOptionsType
 */
export abstract class Component<O extends ComponentOptions = {}> {
  constructor(
    protected readonly $client: JovoWebClient,
    protected readonly $initOptions?: Partial<O>,
  ) {}

  get initOptions(): Partial<O> | undefined {
    return this.$initOptions;
  }

  get name(): string {
    return this.constructor.name;
  }

  get options(): O {
    return this.$client.options[this.name];
  }

  abstract async onInit(): Promise<void>;

  async onStop(): Promise<void> {
    // tslint:disable-line
  }

  abstract getDefaultOptions(): O;
}
