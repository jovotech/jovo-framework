import get = require('lodash.get');
import { InitConfig, JovoWebClient } from '../src';

export function expectClientOptionToBe<T = any>(
  client: JovoWebClient,
  pathToOption: string,
  expectedValue: T,
) {
  expect<T>(get(client.$config, pathToOption)).toBe(expectedValue);
}

export function makeTestClient(
  url = '',
  config: InitConfig = { initBaseComponents: false },
): JovoWebClient {
  return new JovoWebClient(url, config);
}
