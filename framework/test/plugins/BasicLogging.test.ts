import { BasicLogging, Jovo, JovoRequest, JovoResponse } from '../../src';

test('logRequest', () => {
  const basicLogging = new BasicLogging({
    enabled: true,
  });
  const jovo = { $request: { foo: 'bar' } as unknown as JovoRequest, $data: {} } as Jovo;
  // eslint-disable-next-line no-console
  const logMethod = console.log;
  // eslint-disable-next-line no-console
  console.log = jest.fn(logMethod);
  basicLogging.logRequest(jovo);
  // eslint-disable-next-line no-console
  expect(console.log).toHaveBeenCalled();
});

test('logRequest', () => {
  const basicLogging = new BasicLogging({
    enabled: true,
  });
  const jovo = { $response: { foo: 'bar' } as unknown as JovoResponse, $data: {} } as Jovo;
  // eslint-disable-next-line no-console
  const logMethod = console.log;
  // eslint-disable-next-line no-console
  console.log = jest.fn(logMethod);
  basicLogging.logResponse(jovo);
  // eslint-disable-next-line no-console
  expect(console.log).toHaveBeenCalled();
});
