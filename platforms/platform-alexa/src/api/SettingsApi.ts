import { AxiosError, JovoError } from '@jovotech/framework';
import { AlexaApiError, AlexaApiErrorCode, AlexaApiOptions, sendApiRequest } from './AlexaApi';

export const TIMEZONE = 'System.timeZone';

export async function getSystemTimeZone(
  apiEndpoint: string,
  deviceId: string,
  permissionToken: string,
): Promise<string> {
  const options: AlexaApiOptions = {
    endpoint: apiEndpoint,
    path: `/v2/devices/${deviceId}/settings/${TIMEZONE}`,
    permissionToken,
    method: 'GET',
  };

  try {
    const response = await sendApiRequest<string>(options);
    return response.data;
  } catch (error) {
    handleSettingsApiErrors(error);
  }
  throw new Error('Unexpected error.');
}

// TODO: distance measurement
// TODO: temperature measurement

// TODO: needs to be refactored after completion of all Alexa APIs
export function handleSettingsApiErrors(error: AxiosError): Error | void {
  if (error.isAxiosError) {
    const { message, code } = error.response?.data || {};
    let errorCode: AlexaApiErrorCode = AlexaApiErrorCode.ERROR;

    if (error.response?.status === 401) {
      errorCode = AlexaApiErrorCode.NO_USER_PERMISSION;
    }

    if (code === 'ALERT_NOT_FOUND') {
      errorCode = AlexaApiErrorCode.ALERT_NOT_FOUND;
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
