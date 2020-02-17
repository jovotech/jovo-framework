import { JovoWebClient } from '../JovoWebClient';

export abstract class CoreComponent {
  abstract readonly name: string;

  constructor(protected readonly $client: JovoWebClient) {}
}
