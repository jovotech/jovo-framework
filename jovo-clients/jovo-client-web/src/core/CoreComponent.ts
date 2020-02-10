import { JovoWebClient } from '../JovoWebClient';

export abstract class CoreComponent {
  readonly abstract name: string;
  constructor(protected readonly $client: JovoWebClient) {}
}
