import get = require('lodash.get');
import { JovoWebClient, JovoWebClientOptions } from '../src';

export function expectClientOptionToBe<T = any>(
  client: JovoWebClient,
  pathToOption: string,
  expectedValue: T,
) {
  expect<T>(get(client.options, pathToOption)).toBe(expectedValue);
}

export function makeTestClient(
  url: string = '',
  options: Partial<JovoWebClientOptions> = { initBaseComponents: false },
): JovoWebClient {
  return new JovoWebClient(url, options);
}
