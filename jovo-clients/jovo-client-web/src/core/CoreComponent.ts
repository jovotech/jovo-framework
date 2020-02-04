import { JovoWebClient } from '../JovoWebClient';

export class CoreComponent {
  constructor(protected readonly $client: JovoWebClient) {}

  get name(): string {
    return this.constructor.name;
  }
}
