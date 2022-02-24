import { getSystemTimeZone } from '../src/api/SettingsApi';
import { mockAlexaApi } from './mocks';

const ENDPOINT = 'https://mock.alexa.com';

test('getSystemTimeZone', async () => {
  mockAlexaApi({
    method: 'GET',
    permissionToken: 'perm_token',
    path: '/v2/devices/device_id/settings/System.timeZone',
    endpoint: ENDPOINT,

    response: {
      statusCode: 200,
      body: 'Australia/Brisbane',
    },
  });

  const res = await getSystemTimeZone(ENDPOINT, 'device_id', 'perm_token');
  expect(res).toEqual('Australia/Brisbane');
});
