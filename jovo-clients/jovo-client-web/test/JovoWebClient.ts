import { InputComponent, JovoWebClient, LoggerComponent, LogLevel } from '../src';
import { expectClientOptionToBe, makeTestClient } from './util';

describe('test JovoWebClient', () => {
  let client: JovoWebClient;

  const loggerComponentName = 'LoggerComponent';
  const logLevelPath = `${loggerComponentName}.level`;

  beforeEach(() => {
    client = makeTestClient();
  });

  test('test set volume', () => {
    client.volume = 0.25;
    expect(client.volume).toBe(0.25);
  });

  test('test use (first time) (no $config)', () => {
    client.use(new LoggerComponent(client));
    expect(client.component(loggerComponentName)).toBeDefined();
    expectClientOptionToBe(client, logLevelPath, LoggerComponent.DEFAULT_CONFIG.level);
  });

  test('test use (first time) ($config)', () => {
    client.use(new LoggerComponent(client, { level: LogLevel.Info }));
    expect(client.component(loggerComponentName)).toBeDefined();
    expectClientOptionToBe(client, logLevelPath, LogLevel.Info);
  });

  test('test use (override) ($config)', () => {
    client.use(
      new LoggerComponent(client),
      new LoggerComponent(client, { level: LogLevel.Warning }),
    );
    expect(client.component(loggerComponentName)).toBeDefined();
    expectClientOptionToBe(client, logLevelPath, LogLevel.Warning);
  });

  test('test removeComponent', () => {
    client.use(new LoggerComponent(client));
    client.removeComponent(loggerComponentName);
    expect(client.component(loggerComponentName)).toBeUndefined();
  });

  test('test removeAllComponents', () => {
    client.use(new InputComponent(client), new LoggerComponent(client)).removeAllComponents();
    expect(client.component(loggerComponentName)).toBeUndefined();
    expect(client.component('InputComponent')).toBeUndefined();
  });
});
