import { BasicLogging, Jovo, JovoRequest, JovoResponse } from '../../src';

test('logRequest', () => {
  const basicLogging = new BasicLogging({
    enabled: true,
  });
  const jovo = { $request: { foo: 'bar' } as unknown as JovoRequest, $data: {} } as Jovo;
  const logMethod = console.log;
  console.log = jest.fn(logMethod);
  basicLogging.logRequest(jovo);
  expect(console.log).toHaveBeenCalled();
});

test('logRequest', () => {
  const basicLogging = new BasicLogging({
    enabled: true,
  });
  const jovo = { $response: { foo: 'bar' } as unknown as JovoResponse, $data: {} } as Jovo;
  const logMethod = console.log;
  console.log = jest.fn(logMethod);
  basicLogging.logResponse(jovo);
  expect(console.log).toHaveBeenCalled();
});
