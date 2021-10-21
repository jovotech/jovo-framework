import { Server } from './../src/Server';
const originalHeaders = {
  Host: 'localhost:3000',
  Authorization: 'Bearer TOKEN',
};
const headers = Server.convertToLowerCaseHeaderKeys(originalHeaders);

describe('convertToLowerCaseHeaderKeys converts header keys to lowercase', () => {
  test('keys to lowercase', () => {
    expect(headers).toHaveProperty('host');
    expect(headers).toHaveProperty('authorization');
  });

  test('values same es in original header', () => {
    const sameValue = originalHeaders.Authorization === headers.authorization;

    expect(sameValue).toBeTruthy();
  });
});
