import { AxiosError, JovoError } from '@jovotech/framework';
import { AlexaApiError, AlexaApiErrorCode, AlexaApiOptions, sendApiRequest } from './AlexaApi';

export const ADDRESS = 'address';
export const COUNTRY_AND_POSTAL_CODE = 'address/countryAndPostalCode';

export interface DeviceLocation {
  city: string;
  countryCode: string;
  postalCode: string;
}

export interface DeviceAddressLocation extends DeviceLocation {
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  districtOrCounty: string;
  stateOrRegion: string;
  city: string;
}

export async function getDeviceLocation(
  apiEndpoint: string,
  deviceId: string,
  permissionToken: string,
): Promise<DeviceLocation> {
  const options: AlexaApiOptions = {
    endpoint: apiEndpoint,
    path: `/v1/devices/${deviceId}/settings/${COUNTRY_AND_POSTAL_CODE}`,
    permissionToken,
    method: 'GET',
  };

  try {
    const response = await sendApiRequest<DeviceLocation>(options);
    return response.data;
  } catch (error) {
    handleDeviceLocationApiErrors(error);
  }
  throw new Error('Unexpected error.');
}

export async function getDeviceAddress(
  apiEndpoint: string,
  deviceId: string,
  permissionToken: string,
): Promise<DeviceAddressLocation> {
  const options: AlexaApiOptions = {
    endpoint: apiEndpoint,
    path: `/v1/devices/${deviceId}/settings/${ADDRESS}`,
    permissionToken,
    method: 'GET',
  };

  try {
    const response = await sendApiRequest<DeviceAddressLocation>(options);
    return response.data;
  } catch (error) {
    handleDeviceLocationApiErrors(error);
  }
  throw new Error('Unexpected error.');
}

// TODO: needs to be refactored after completion of all Alexa APIs
export function handleDeviceLocationApiErrors(error: AxiosError): Error | void {
  if (error.isAxiosError) {
    const { message, code } = error.response?.data;
    let errorCode: AlexaApiErrorCode = AlexaApiErrorCode.ERROR;

    if (error.response?.status === 401) {
      errorCode = AlexaApiErrorCode.NO_USER_PERMISSION;
    }

    if (code === 'DEVICE_NOT_SUPPORTED') {
      errorCode = AlexaApiErrorCode.DEVICE_NOT_SUPPORTED;
    }

    if (code === 'ALERT_NOT_FOUND') {
      errorCode = AlexaApiErrorCode.ALERT_NOT_FOUND;
    }

    // User needs to grant access in app
    if (
      message === 'The authentication token is not valid.' ||
      message === 'Access to this resource has not yet been requested.' ||
      (code === 'ACCESS_DENIED' && message === 'Access denied with reason: ACCESS_NOT_REQUESTED')
    ) {
      errorCode = AlexaApiErrorCode.NO_USER_PERMISSION;
    }

    // Dev needs to set correct permissions in ASK console
    if (
      message === 'Access to this resource cannot be requested.' ||
      (code === 'ACCESS_DENIED' && message === 'Access denied with reason: FORBIDDEN')
    ) {
      errorCode = AlexaApiErrorCode.NO_SKILL_PERMISSION;
    }

    throw new AlexaApiError({ message: error.message, code: errorCode });
  }
  throw new JovoError({ message: error.message });
}
