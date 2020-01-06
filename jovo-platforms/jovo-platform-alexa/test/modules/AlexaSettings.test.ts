import { AlexaAPI } from '../../src/services/AlexaAPI';
import { AlexaSettings } from '../../src/services/AlexaSettings';
import { ApiError } from '../../src/services/ApiError';

jest.mock('../../src/services/AlexaAPI');

process.env.NODE_ENV = 'TEST';

test('test 403 ERROR', async () => {
  // @ts-ignore
  AlexaAPI.apiCall.mockImplementation(({}) => {
    return Promise.reject(new Error());
  });
  const result = AlexaSettings.settingsAPI(
    AlexaSettings.TEMPERATURE_UNITS,
    'apiEndPoint',
    'permissionToken',
    'deviceId',
  );
  expect(result).rejects.toThrow('Something went wrong.');
  try {
    await result;
  } catch (e) {
    expect(e.code).toBe(ApiError.ERROR);
  }
});

test('test Timezone', async () => {
  // @ts-ignore
  AlexaAPI.apiCall.mockImplementation(({}) => {
    return Promise.resolve({
      status: 200,
      data: 'Europe/Berlin',
    });
  });

  expect(
    AlexaSettings.settingsAPI(AlexaSettings.TIMEZONE, 'apiEndPoint', 'permissionToken', 'deviceId'),
  ).resolves.toBe('Europe/Berlin');
});

test('test Distance Units', async () => {
  // @ts-ignore
  AlexaAPI.apiCall.mockImplementation(({}) => {
    return Promise.resolve({
      status: 200,
      data: 'METRIC',
    });
  });
  expect(
    AlexaSettings.settingsAPI(
      AlexaSettings.DISTANCE_UNITS,
      'apiEndPoint',
      'permissionToken',
      'deviceId',
    ),
  ).resolves.toBe('METRIC');
});

test('test Temperature Units', async () => {
  // @ts-ignore
  AlexaAPI.apiCall.mockImplementation(({}) => {
    return Promise.resolve({
      status: 200,
      data: 'CELSIUS',
    });
  });
  expect(
    AlexaSettings.settingsAPI(
      AlexaSettings.TEMPERATURE_UNITS,
      'apiEndPoint',
      'permissionToken',
      'deviceId',
    ),
  ).resolves.toBe('CELSIUS');
});

test('test undefined permissionToken', async () => {
  const token: undefined = undefined;
  expect(
    // @ts-ignore
    AlexaSettings.settingsAPI(AlexaSettings.TEMPERATURE_UNITS, 'apiEndPoint', token, 'deviceId'),
  ).rejects.toThrow('No permissionToken was found in that request');
});

test('test invalid property', async () => {
  expect(
    AlexaSettings.settingsAPI('propertyABC', 'apiEndPoint', 'permissionToken', 'deviceId'),
  ).rejects.toThrow('propertyABC is not a valid property');
});
