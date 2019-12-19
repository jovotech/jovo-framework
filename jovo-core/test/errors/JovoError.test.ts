import { ErrorCode, JovoError } from '../../src';

test('test JovoError class', () => {
  const jovoError = new JovoError('message', 'ERR_CODE', 'module', 'details', 'hint', 'seeMore');
  expect(jovoError.message).toBe('message');
  expect(jovoError.code).toBe('ERR_CODE');
  expect(jovoError.module).toBe('module');
  expect(jovoError.details).toBe('details');
  expect(jovoError.hint).toBe('hint');
  expect(jovoError.seeMore).toBe('seeMore');
});

test('test JovoError ErrorCode', () => {
  const jovoError = new JovoError('message');
  expect(jovoError.message).toBe('message');
  expect(jovoError.code).toBe(ErrorCode.ERR);
});
