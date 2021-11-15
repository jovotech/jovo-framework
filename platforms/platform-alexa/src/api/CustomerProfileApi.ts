import { JovoError } from '@jovotech/framework';
import { AlexaApiError, AlexaApiErrorCode, AlexaApiOptions, sendApiRequest } from './AlexaApi';

export enum ProfileProperty {
  NAME = 'name',
  GIVEN_NAME = 'givenName',
  EMAIL = 'email',
  MOBILE_NUMBER = 'mobileNumber',
}

/**
 * Determines the response type for the Customer Profile API.
 * For mobileNumber, returns the mobileNumber with the respective countryCode.
 * Otherwise just returns the result string.
 */
export type CustomerProfileApiResponse<PROPERTY extends ProfileProperty> =
  PROPERTY extends ProfileProperty.MOBILE_NUMBER
    ? { [ProfileProperty.MOBILE_NUMBER]: string; countryCode: string }
    : string;

/**
 * Sends a request to Amazon's Customer Profile API for getting profile information
 * @param profileProperty - The profile property which determines the final API endpoint url
 * @param apiEndpoint - API endpoint, differs on the geographic location of the skill
 * @param permissionToken - Token to authorize the request
 */
export async function sendCustomerProfileApiRequest<PROPERTY extends ProfileProperty>(
  profileProperty: PROPERTY,
  apiEndpoint: string,
  permissionToken: string,
): Promise<CustomerProfileApiResponse<PROPERTY>> {
  const options: AlexaApiOptions = {
    endpoint: apiEndpoint,
    path: `/v2/accounts/~current/settings/Profile.${profileProperty}`,
    permissionToken,
  };

  try {
    const response = await sendApiRequest<CustomerProfileApiResponse<PROPERTY>>(options);
    return response.data;
  } catch (error) {
    if (error.isAxiosError) {
      const { message, code } = error.response.data;
      let errorCode: AlexaApiErrorCode = AlexaApiErrorCode.ERROR;

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

      throw new AlexaApiError({ message, code: errorCode });
    }

    throw new JovoError({ message: error.message });
  }
}
