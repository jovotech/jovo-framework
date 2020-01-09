import { AlexaAPI } from '../../src/services/AlexaAPI';
import { AlexaContact } from '../../src/services/AlexaContact';
import { ApiError } from '../../src/services/ApiError';

jest.mock('../../src/services/AlexaAPI');

process.env.NODE_ENV = 'TEST';

test('test 403 NO_USER_PERMISSION', async () => {
  // @ts-ignore
  AlexaAPI.apiCall.mockImplementation(({}) => {
    return Promise.resolve({
      status: 403,
      data: {
        message: 'Access to this resource has not yet been requested.',
      },
    });
  });

  const result = AlexaContact.contactAPI(AlexaContact.NAME, 'apiEndPoint', 'permissionToken');
  expect(result).rejects.toThrow('Access to this resource has not yet been requested.');

  try {
    await result;
  } catch (e) {
    expect(e.code).toBe(ApiError.NO_USER_PERMISSION);
  }
});

test('test 403 NO_SKILL_PERMISSION', async () => {
  // @ts-ignore
  AlexaAPI.apiCall.mockImplementation(({}) => {
    return Promise.resolve({
      status: 403,
      data: {
        message: 'Access to this resource cannot be requested.',
      },
    });
  });
  const result = AlexaContact.contactAPI(AlexaContact.NAME, 'apiEndPoint', 'permissionToken');
  expect(result).rejects.toThrow('Access to this resource cannot be requested.');
  try {
    await result;
  } catch (e) {
    expect(e.code).toBe(ApiError.NO_SKILL_PERMISSION);
  }
});

test('test 403 ERROR', async () => {
  // @ts-ignore
  AlexaAPI.apiCall.mockImplementation(({}) => {
    return Promise.reject(new Error());
  });
  const result = AlexaContact.contactAPI(AlexaContact.NAME, 'apiEndPoint', 'permissionToken');
  expect(result).rejects.toThrow('Something went wrong.');
  try {
    await result;
  } catch (e) {
    expect(e.code).toBe(ApiError.ERROR);
  }
});

test('test NAME', async () => {
  // @ts-ignore
  AlexaAPI.apiCall.mockImplementation(({}) => {
    return Promise.resolve({
      status: 200,
      data: 'John Doe',
    });
  });

  expect(
    AlexaContact.contactAPI(AlexaContact.NAME, 'apiEndPoint', 'permissionToken'),
  ).resolves.toBe('John Doe');
});

test('test FULLNAME', async () => {
  // @ts-ignore
  AlexaAPI.apiCall.mockImplementation(({}) => {
    return Promise.resolve({
      status: 200,
      data: 'John Doe',
    });
  });

  expect(
    AlexaContact.contactAPI(AlexaContact.NAME, 'apiEndPoint', 'permissionToken'),
  ).resolves.toBe('John Doe');
});

test('test GIVEN_NAME', async () => {
  // @ts-ignore
  AlexaAPI.apiCall.mockImplementation(({}) => {
    return Promise.resolve({
      status: 200,
      data: 'Joe',
    });
  });
  expect(
    AlexaContact.contactAPI(AlexaContact.GIVEN_NAME, 'apiEndPoint', 'permissionToken'),
  ).resolves.toBe('Joe');
});

test('test MOBILE_NUMBER', async () => {
  // @ts-ignore
  AlexaAPI.apiCall.mockImplementation(({}) => {
    return Promise.resolve({
      status: 200,
      data: '12345',
    });
  });
  expect(
    AlexaContact.contactAPI(AlexaContact.MOBILE_NUMBER, 'apiEndPoint', 'permissionToken'),
  ).resolves.toBe('12345');
});

test('test undefined permissionToken', async () => {
  const token: undefined = undefined;
  // @ts-ignore
  expect(AlexaContact.contactAPI(AlexaContact.EMAIL, 'apiEndPoint', token)).rejects.toThrow(
    'No permissions from user.',
  );
});

test('test invalid property', async () => {
  expect(AlexaContact.contactAPI('propertyABC', 'apiEndPoint', 'permissionToken')).rejects.toThrow(
    'propertyABC is not a valid property',
  );
});
