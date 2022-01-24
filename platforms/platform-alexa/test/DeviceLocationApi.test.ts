import { getDeviceLocation, getDeviceAddress } from '../src/api/DeviceLocationApi';
import { AlexaApiErrorCode } from '../src/api/AlexaApi';
import { mockAlexaApi } from './mocks';

const ENDPOINT = 'https://mock.alexa.com';

test('NO_USER_PERMISSION', async () => {
  mockAlexaApi({
    method: 'GET',
    permissionToken: 'perm_token',
    path: '/v1/devices/device_id/settings/address/countryAndPostalCode',
    endpoint: ENDPOINT,

    response: {
      statusCode: 401,
      body: {
        code: 'NO_USER_PERMISSION',
        message: 'Access to this resource has not yet been requested.',
      },
    },
  });

  try {
    await getDeviceLocation(ENDPOINT, 'device_id', 'perm_token');
  } catch (e) {
    expect(e.code).toBe(AlexaApiErrorCode.NO_USER_PERMISSION);
  }
});

test('DEVICE_NOT_SUPPORTED', async () => {
  mockAlexaApi({
    method: 'GET',
    permissionToken: 'perm_token',
    path: '/v1/devices/device_id/settings/address/countryAndPostalCode',
    endpoint: ENDPOINT,

    response: {
      statusCode: 403,
      body: {
        code: 'DEVICE_NOT_SUPPORTED',
      },
    },
  });

  try {
    await getDeviceLocation(ENDPOINT, 'device_id', 'perm_token');
  } catch (e) {
    expect(e.code).toBe(AlexaApiErrorCode.DEVICE_NOT_SUPPORTED);
  }
});

test('getDeviceLocation', async () => {
  const LOCATION = {
    countryCode: 'countryCode',
    postalCode: 'postalCode',
    city: 'city',
  };

  mockAlexaApi({
    method: 'GET',
    permissionToken: 'perm_token',
    path: '/v1/devices/device_id/settings/address/countryAndPostalCode',
    endpoint: ENDPOINT,

    response: {
      statusCode: 200,
      body: LOCATION,
    },
  });

  const res = await getDeviceLocation(ENDPOINT, 'device_id', 'perm_token');
  expect(res).toEqual(LOCATION);
});

test('getDeviceAddress', async () => {
  const ADDRESS = {
    addressLine1: 'addressLine1',
    addressLine2: 'addressLine2',
    addressLine3: '',
    districtOrCounty: '',
    stateOrRegion: 'stateOrRegion',
    city: 'city',
    countryCode: 'countryCode',
    postalCode: 'postalCode',
  };
  mockAlexaApi({
    method: 'GET',
    permissionToken: 'perm_token',
    path: '/v1/devices/device_id/settings/address',
    endpoint: ENDPOINT,

    response: {
      statusCode: 200,
      body: ADDRESS,
    },
  });

  const res = await getDeviceAddress(ENDPOINT, 'device_id', 'perm_token');
  expect(res).toEqual(ADDRESS);
});
