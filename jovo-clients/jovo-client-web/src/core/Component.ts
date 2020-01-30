import { ComponentConfig, CoreComponent, JovoWebClient } from '..';

export abstract class Component<
  CONFIG extends ComponentConfig = ComponentConfig
> extends CoreComponent {
  constructor(
    protected readonly $client: JovoWebClient,
    protected readonly $initConfig?: Partial<CONFIG>,
  ) {
    super($client);
  }

  get initConfig(): Partial<CONFIG> | undefined {
    return this.$initConfig;
  }

  get $config(): CONFIG {
    return this.$client.$config[this.name];
  }

  abstract async onInit(): Promise<void>;

  async onStop(): Promise<void> {
    // tslint:disable-line
  }

  abstract getDefaultConfig(): CONFIG;
}
